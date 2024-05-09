import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from 'src/dtos/Appointments.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async getAppointments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.appointmentsService.getAppointments(page, limit);
  }

  @Post()
  async createAppointment(@Body() appointment: CreateAppointmentDto) {
    console.log('llegmos');
    return await this.appointmentsService.createAppointments(appointment);
  }

  @Put(':id')
  async updateAppointment() {
    return this.appointmentsService.updateAppointment();
  }
  @Get(':id')
  async getAppointmentById(@Param('id') id: string) {
    return this.appointmentsService.getAppointmentById(id);
  }
}
