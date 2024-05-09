import { Module } from '@nestjs/common';
import { ParkingLotController } from './parking-lot.controller';
import { ParkingLotService } from './parking-lot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingLot } from 'src/entities/parkingLot.entity';
import { ParkingLotRepository } from './parking-lot.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingLot])],
  controllers: [ParkingLotController],
  providers: [ParkingLotService, ParkingLotRepository],
})
export class ParkingLotModule {}
