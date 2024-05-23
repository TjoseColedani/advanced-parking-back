import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateParkingLotDto } from 'src/dtos/ParkingLot.dto';
import { Role } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/roles.decorators';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guards';

@ApiTags('parking-lot')
@Controller('parking-lot')
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @Get('seeder')
  async addParkingLots() {
    return await this.parkingLotService.addParkingLots();
  }

  @Get()
  async getParkingLots(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.parkingLotService.getParkingLots(page, limit);
  }

  @Get(':id')
  async getParkingLotById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.parkingLotService.getParkingLotById(id);
  }

  @Post()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async createParkingLot(@Body() parkingLot: CreateParkingLotDto) {
    return await this.parkingLotService.createParkingLot(parkingLot);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteParkingLot(@Param('id', ParseUUIDPipe) parkingLotId: string) {
    return await this.parkingLotService.deleteParkingLot(parkingLotId);
  }
}
