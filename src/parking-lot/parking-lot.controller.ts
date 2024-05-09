import {
  Controller,
  Get,
  // , OnModuleInit
} from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';

@Controller('parking-lot')
//  implements OnModuleInit
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @Get('seeder')
  async addParkingLots() {
    return this.parkingLotService.addParkingLots();
  }

  // async onModuleInit() {
  //   await this.parkingLotService.addParkingLots();
  // }
}
