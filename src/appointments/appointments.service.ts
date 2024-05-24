import { Injectable } from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from 'src/dtos/Appointments.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}
  async getAppointments(page?: number, limit?: number) {
    return await this.appointmentsRepository.getAppointments(page, limit);
  }
  async createAppointments(appointment: CreateAppointmentDto) {
    return await this.appointmentsRepository.createAppointments(appointment);
  }

  async updateAppointmentStatus(id: string, newStatus: UpdateAppointmentDto) {
    return await this.appointmentsRepository.updateAppointmentStatus(
      id,
      newStatus,
    );
  }
  async cancelAppointment(id: string) {
    return await this.appointmentsRepository.cancelAppointment(id);
  }
  async getAppointmentById(id: string) {
    return await this.appointmentsRepository.getAppointmentById(id);
  }
  async deleteAppointments(id: string) {
    return await this.appointmentsRepository.deleteAppointments(id);
  }

  async cancelAppointments(id: string) {
    return await this.appointmentsRepository.cancelAppointmentByError(id);
  }
}
