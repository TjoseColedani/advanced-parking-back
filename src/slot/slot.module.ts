import { Module } from '@nestjs/common';
import { SlotController } from './slot.controller';
import { SlotService } from './slot.service';
import { SlotRepository } from './slot.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from 'src/entities/slot.entity';
import { ParkingLot } from 'src/entities/parkingLot.entity';
import { ParkingLotRepository } from 'src/parking-lot/parking-lot.repository';
import { Appointment } from 'src/entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slot, ParkingLot, Appointment])],
  controllers: [SlotController],
  providers: [SlotService, SlotRepository, ParkingLotRepository],
  exports: [SlotRepository],
})
export class SlotModule {}
