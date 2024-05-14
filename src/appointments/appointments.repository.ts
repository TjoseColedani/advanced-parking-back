import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAppointmentDto } from 'src/dtos/Appointments.dto';
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
      },
    });
    if (myAppointment) {
      throw new BadRequestException('Appointment already exists');
    }

    const oldAppointment = await this.appointmentsRepository.findOne({
      where: {
        date: appointment.date,
        time: appointment.time,
        parking_lot: parkingLot,
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
      relations: { parking_lot: { slot: true } },
    });
  }

  async updateAppointment() {}
  async getAppointmentById(@Param('id') id: string) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id: id },
      relations: { parking_lot: true, slot: true },
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    return appointment;
  }
}
