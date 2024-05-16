import { Controller, Get, Param, Query } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('parking-lot')
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

  @Get(':id')
  async getParkingLotById(@Param('id') id: string) {
    return this.parkingLotService.getParkingLotById(id);
  }
}
