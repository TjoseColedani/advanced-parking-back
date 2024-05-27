import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateParkingLotDto,
  UpdateParkingLotDto,
} from 'src/dtos/ParkingLot.dto';
import { Role } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/roles.decorators';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guards';

@ApiTags('parking-lot')
@Controller('parking-lot')
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @Get('seeder')
  @ApiOperation({summary: 'Seeder to add parking lots'})
  async addParkingLots() {
    return await this.parkingLotService.addParkingLots();
  }

  @Get()
  @ApiOperation({summary: 'Get parking lots'})
  async getParkingLots(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.parkingLotService.getParkingLots(page, limit);
  }

  @Get(':id')
  @ApiOperation({summary: 'Get parking lots by id'})
  async getParkingLotById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.parkingLotService.getParkingLotById(id);
  }

  @Post()
  @ApiOperation({summary: 'Create parking lot (admin only)'})
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async createParkingLot(@Body() parkingLot: CreateParkingLotDto) {
    return await this.parkingLotService.createParkingLot(parkingLot);
  }

  @Put(':id')
  @ApiOperation({summary: 'Update parking lot (admin only)'})
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async updateParkingLot(
    @Body() parkingLot: UpdateParkingLotDto,
    @Param('id', ParseUUIDPipe) parkingLotId: string,
  ) {
    return await this.parkingLotService.updateParkingLot(
      parkingLot,
      parkingLotId,
    );
  }

  @Delete(':id')
  @ApiOperation({summary: 'Delete parking lot (admin only)'})
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteParkingLot(@Param('id', ParseUUIDPipe) parkingLotId: string) {
    return await this.parkingLotService.deleteParkingLot(parkingLotId);
  }
}
