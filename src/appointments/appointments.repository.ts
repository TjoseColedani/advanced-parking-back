import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from 'src/dtos/Appointments.dto';
import { EmailSenderRepository } from 'src/email-sender/email-sender.repository';
import { Appointment } from 'src/entities/appointment.entity';
import { ParkingLot } from 'src/entities/parkingLot.entity';
import { Slot } from 'src/entities/slot.entity';
import { User } from 'src/entities/user.entity';
import { SlotStatus } from 'src/enums/slot-status.enum';
import { LessThan, MoreThan, Repository } from 'typeorm';

@Injectable()
export class AppointmentsRepository {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Slot)
    private slotRepository: Repository<Slot>,

    @InjectRepository(ParkingLot)
    private parkingLotRepository: Repository<ParkingLot>,

    private readonly emailSenderRepository: EmailSenderRepository,
  ) {}

  private convertToDateTime(date: string, time: string): Date {
    const [year, month, day] = date
      .split('/')
      .map((part) => parseInt(part, 10));
    const [hours, minutes] = time.split(':').map((part) => parseInt(part, 10));
    return new Date(year, month - 1, day, hours, minutes);
  }
  async getAppointments(page?: number, limit?: number): Promise<Appointment[]> {
    if (page !== undefined && limit !== undefined) {
      const offset = (page - 1) * limit;
      return await this.appointmentsRepository.find({
        relations: {
          user: true,
          slot: {
            parking_lot: true,
          },
        },
        take: limit,
        skip: offset,
      });
    } else {
      return await this.appointmentsRepository.find({
        relations: { slot: { parking_lot: true } },
      });
    }
  }
  async createAppointments({
    parkingLotId,
    ...appointment
  }: CreateAppointmentDto) {
    if (!parkingLotId)
      throw new BadRequestException('Parking id cannot be undefined');

    const user = await this.userRepository.findOne({
      where: { id: appointment.user_id },
    });
    if (!user) throw new NotFoundException('User not found');

    const parkingLot = await this.parkingLotRepository.findOneBy({
      id: parkingLotId,
    });
    if (!parkingLot) throw new NotFoundException('Parking lot not found');

    const myAppointment = await this.appointmentsRepository.findOne({
      where: {
        license_plate: appointment.license_plate,
        date: appointment.date,
        time: appointment.time,
      },
    });
    if (myAppointment) {
      throw new BadRequestException('Appointment already exists');
    }
    const newDate = appointment.date.split('-').join('/');
    // console.log('new date', newDate);

    const startTime = this.convertToDateTime(newDate, appointment.time);
    // console.log('start time', startTime);

    const durationInMinutes = parseInt(appointment.duration) * 60;
    const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);
    // console.log('end time', endTime);

    const oldAppointment = await this.appointmentsRepository.findOne({
      where: {
        start_time: LessThan(endTime),
        end_time: MoreThan(startTime),
        parking_lot: parkingLot,
        slot_number: appointment.slot_number,
      },
    });
    if (oldAppointment) {
      throw new BadRequestException('Not found a slot available');
    }

    const slotInParkingLot = await this.parkingLotRepository.findOne({
      where: { id: parkingLotId, slots_stock: MoreThan(0) },
    });
    if (!slotInParkingLot) {
      throw new BadRequestException('Parking lot is full');
    }

    const slot = await this.slotRepository.findOne({
      where: {
        parking_lot: slotInParkingLot,
        slot_status: SlotStatus.Available,
        slot_number: Number(appointment.slot_number),
      },
    });

    if (!slot) throw new BadRequestException('Parking slot is not available');
    const newAppointment = new Appointment();

    newAppointment.license_plate = appointment.license_plate;
    newAppointment.date = appointment.date;
    newAppointment.time = appointment.time;
    newAppointment.is_parked = appointment.is_parked;
    newAppointment.user = user;
    newAppointment.duration = appointment.duration;
    newAppointment.slot = slot;
    newAppointment.parking_lot = parkingLot;
    newAppointment.status = 'active';
    newAppointment.total = appointment.total;
    newAppointment.slot_number = appointment.slot_number;
    newAppointment.start_time = startTime;
    newAppointment.end_time = endTime;

    const createdAppointment =
      await this.appointmentsRepository.save(newAppointment);
    if (!createdAppointment)
      throw new BadRequestException('error saving appointment');

    try {
      await this.emailSenderRepository.sendReservationConfirmationEmail({
        name: user.name,
        email: user.email,
        date: createdAppointment.date,
        time: createdAppointment.time,
        slot: createdAppointment.slot_number,
        parkingLot: createdAppointment.parking_lot.name,
        location: createdAppointment.parking_lot.location,
      });
    } catch {
      throw new BadRequestException(
        'Error sending reservation confirmation email',
      );
    }
    return await this.appointmentsRepository.findOne({
      where: { id: createdAppointment.id },
      relations: { parking_lot: true, slot: true },
    });
  }
  async updateAppointmentStatus(id: string, newStatus: UpdateAppointmentDto) {
    const appointment = await this.appointmentsRepository.findOneBy({ id });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    const slot = await this.slotRepository.findOne({
      where: { id: appointment.slot.id },
    });
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }
    await this.appointmentsRepository.update(appointment.id, newStatus);

    await this.slotRepository.update(slot.id, {
      slot_status: newStatus.slot_status,
    });
    return await this.appointmentsRepository.findOne({
      where: { id },
      relations: { slot: { parking_lot: true } },
    });
  }
  async cancelAppointment(id: string) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id: id, status: 'active' },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    const slot = await this.slotRepository.update(appointment.slot.id, {
      slot_status: SlotStatus.Available,
    });
    if (!slot) {
      throw new BadRequestException('Error to update');
    }
    const appointmentDeleted = await this.appointmentsRepository.update(id, {
      status: 'deleted',
    });
    if (!appointmentDeleted)
      throw new BadRequestException('Error to delete appointment');

    return 'appointment cancelled successfully';
  }
  async getAppointmentById(@Param('id') id: string) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id: id },
      relations: { parking_lot: true, slot: true, user: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }
  async deleteAppointments(id: string) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id: id },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    const appointmentDeleted = await this.appointmentsRepository.update(id, {
      status: 'deleted',
    });
    if (!appointmentDeleted)
      throw new BadRequestException('Error to delete appointment');
  }
}
