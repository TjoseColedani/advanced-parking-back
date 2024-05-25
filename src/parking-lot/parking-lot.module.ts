import { Module } from '@nestjs/common';
import { ParkingLotController } from './parking-lot.controller';
import { ParkingLotService } from './parking-lot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingLot } from 'src/entities/parkingLot.entity';
import { ParkingLotRepository } from './parking-lot.repository';
import { SlotModule } from 'src/slot/slot.module';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingLot]), SlotModule],
  controllers: [ParkingLotController],
  providers: [ParkingLotService, ParkingLotRepository],
})
export class ParkingLotModule {}
