import { Module } from '@nestjs/common';
import { SlotController } from './slot.controller';
import { SlotService } from './slot.service';
import { SlotRepository } from './slot.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from 'src/entities/slot.entity';
import { ParkingLot } from 'src/entities/parkingLot.entity';
import { ParkingLotRepository } from 'src/parking-lot/parking-lot.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Slot, ParkingLot])],
  controllers: [SlotController],
  providers: [SlotService, SlotRepository, ParkingLotRepository],
})
export class SlotModule {}
