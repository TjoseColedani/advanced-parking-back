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
import { Appointment } from 'src/entities/appointment.entity';
import { ParkingLot } from 'src/entities/parkingLot.entity';
import { Slot } from 'src/entities/slot.entity';
import { User } from 'src/entities/user.entity';
import { SlotStatus } from 'src/enums/slot-status.enum';
import { MoreThan, Repository } from 'typeorm';

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
  ) {}
  async getAppointments(page: number, limit: number): Promise<Appointment[]> {
    let appointments = await this.appointmentsRepository.find({
      relations: {
        user: true,
        slot: {
          parking_lot: true,
        },
      },
    });

    const start = (page - 1) * limit;
    const end = start + +limit;

    appointments = appointments.slice(start, end);
    return appointments;
  }
  async createAppointments({
    parkingLotId,
    ...appointment
  }: CreateAppointmentDto) {
    if (parkingLotId === undefined)
      throw new BadRequestException('Parking id cannot be undefined');
    const oldAppointment = await this.appointmentsRepository.findOne({
      where: { license_plate: appointment.license_plate },
    });
    if (oldAppointment) {
      throw new BadRequestException('Appointment already exists');
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
      },
    });

    if (!slot) throw new BadRequestException('Parking slot is not available');
    const newAppointment = new Appointment();

    newAppointment.license_plate = appointment.license_plate;
    newAppointment.date = appointment.date;
    newAppointment.time = appointment.time;
    newAppointment.is_parked = appointment.is_parked;
    newAppointment.duration = appointment.duration;
    newAppointment.slot = slot;

    const createdAppointment =
      await this.appointmentsRepository.save(newAppointment);
    if (!createdAppointment)
      throw new BadRequestException('error saving appointment');

    try {
      await this.slotRepository.update(slot.id, {
        slot_status: SlotStatus.Reserved,
      });
    } catch {
      throw new BadRequestException('error updating slot');
    }
    await this.parkingLotRepository.update(parkingLotId, {
      slots_stock: slotInParkingLot.slots_stock - 1,
    });
    return await this.appointmentsRepository.findOne({
      where: { id: createdAppointment.id },
      relations: { slot: { parking_lot: true } },
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
    await this.appointmentsRepository.update(appointment.id, {
      is_parked: newStatus.is_parked,
    });

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
    await this.appointmentsRepository.update(id, { status: 'deleted' });
    return 'appointment cancelled successfully';
  }
  async getAppointmentById(@Param('id') id: string) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id: id },
      relations: { slot: { parking_lot: true } },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }
}
