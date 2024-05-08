import { Injectable } from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { appointmentDto } from 'src/dtos/Appointments.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}
  async getAppointments(page: number, limit: number) {
    return await this.appointmentsRepository.getAppointments(page, limit);
  }
  async createAppointments(appointment: appointmentDto) {
    return await this.appointmentsRepository.createAppointments(appointment);
  }
  async addAppointment() {
    return await this.appointmentsRepository.addAppointment();
  }

  async updateAppointment() {
    return await this.appointmentsRepository.updateAppointment();
  }
  async getAppointmentById(id: string) {
    return await this.appointmentsRepository.getAppointmentById(id);
  }
}
