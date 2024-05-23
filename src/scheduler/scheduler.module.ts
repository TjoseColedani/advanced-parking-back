import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/entities/appointment.entity';
import { Slot } from 'src/entities/slot.entity';
import { SchedulerService } from './scheduler.service';
import { ParkingLot } from 'src/entities/parkingLot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Slot, ParkingLot])],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
