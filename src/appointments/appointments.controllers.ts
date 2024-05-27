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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guards';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/enums/roles.enum';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @ApiOperation({summary: 'Get all appointments'})
  async getAppointments(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.appointmentsService.getAppointments(page, limit);
  }

  @Post()
  @ApiOperation({summary: 'Create appointment'})
  async createAppointment(@Body() appointment: CreateAppointmentDto) {
    return await this.appointmentsService.createAppointments(appointment);
  }

  @Put('update-status/:id')
  @ApiOperation({summary: 'Update appointment status by id (Admin only)'})
  @Roles(Role.Porter)
  @UseGuards(AuthGuard, RolesGuard)
  async updateAppointmentStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() newStatus: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.updateAppointmentStatus(id, newStatus);
  }

  @Put('/cancel/:id')
  @ApiOperation({summary: 'Cancel appointment by id (Admin only)'})
  async cancelAppointment(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.cancelAppointment(id);
  }

  @Get(':id')
  @ApiOperation({summary: 'Get appointment by id'})
  async getAppointmentById(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.getAppointmentById(id);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Delete appointment by id (admin only)'})
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteAppointmentById(@Param('id') id: string) {
    return await this.appointmentsService.deleteAppointments(id);
  }

  @Put('success/:id')
  @ApiOperation({summary: 'Update appointment by id'})
  @UseGuards(AuthGuard)
  async successPayment(@Param('id', ParseUUIDPipe) id: string) {
    return await this.appointmentsService.successPayment(id);
  }
}
