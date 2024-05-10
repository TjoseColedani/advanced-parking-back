import { Controller, Get, Query } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';

@Controller('parking-lot')
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @Get('seeder')
  async addParkingLots() {
    return this.parkingLotService.addParkingLots();
  }

  @Get()
  async getParkingLots(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.parkingLotService.getParkingLots(page, limit);
  }
}
