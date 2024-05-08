import { BadRequestException, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { appointmentDto } from 'src/dtos/Appointments.dto';
import { Appointment } from 'src/entities/appointment.entity';
import { ParkingLot } from 'src/entities/parkingLot.entity';
import { Slot } from 'src/entities/slot.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

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
  async createAppointments(appointment: appointmentDto) {
    const oldAppointment = await this.appointmentsRepository.findOne({
      where: { license_plate: appointment.license_plate },
    });
    if (oldAppointment) {
      throw new BadRequestException('Appointment already exists');
    }

    const newAppointment = new Appointment();

    newAppointment.license_plate = appointment.license_plate;
    newAppointment.date = appointment.date;
    newAppointment.time = appointment.time;
    newAppointment.duration = appointment.duration;
    newAppointment.is_parked = appointment.is_parked;

    return await this.appointmentsRepository.save(newAppointment);
  }
  async addAppointment() {}

  async updateAppointment() {}
  async getAppointmentById(@Param('id') id: string) {
    const appointment = await this.appointmentsRepository.findOneBy({ id });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    return appointment;
  }
}
