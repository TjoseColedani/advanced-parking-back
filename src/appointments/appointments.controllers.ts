import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from 'src/dtos/Appointments.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guards';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/enums/roles.enum';

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

  @Put('update-status/:id')
  @Roles(Role.Porter)
  @UseGuards(AuthGuard, RolesGuard)
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

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteAppointmentById(@Param('id') id: string) {
    return await this.appointmentsService.deleteAppointments(id);
  }
}
