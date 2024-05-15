import {
  Body,
  Controller,
  Get,
  Param
  ParseUUIDPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from 'src/dtos/Appointments.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async getAppointments(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.appointmentsService.getAppointments(page, limit);
  }

  @Post()
  async createAppointment(@Body() appointment: CreateAppointmentDto) {
    console.log('llegmos');
    return await this.appointmentsService.createAppointments(appointment);
  }

  @Put(':id')
  async updateAppointmentStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() newStatus: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.updateAppointmentStatus(id, newStatus);
  }

  @Put('/cancel/:id')
  async cancelAppointment(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.cancelAppointment(id);
  }

  @Get(':id')
  async getAppointmentById(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.getAppointmentById(id);
  }
}
