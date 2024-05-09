import { Controller, OnModuleInit } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';

@Controller('parking-lot')
export class ParkingLotController implements OnModuleInit {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  async onModuleInit() {
    await this.parkingLotService.addParkingLots();
  }
}
