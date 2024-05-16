import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/entities/appointment.entity';
import { ParkingLot } from 'src/entities/parkingLot.entity';
import { Slot } from 'src/entities/slot.entity';
import { User } from 'src/entities/user.entity';
import { AppointmentsController } from './appointments.controllers';
import { AppointmentsService } from './appointments.service';
import { AppointmentsRepository } from './appointments.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Slot]),
    TypeOrmModule.forFeature([ParkingLot]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsRepository],
})
export class AppointmentModule {}
