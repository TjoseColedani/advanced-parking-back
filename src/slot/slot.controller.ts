import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SlotService } from './slot.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/enums/roles.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guards';
import { CreateSlotDto, UpdateSlotDto } from 'src/dtos/Slot.dto';

@ApiTags('slot')
@Controller('slot')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Get('seeder')
  @ApiOperation({summary: 'Get slots seeder'})
  async slotSeeder() {
    return await this.slotService.slotSeeder();
  }

  @Get()
  @ApiOperation({summary: 'Get available slots'})
  async getAvailableSlots(
    @Query('date') date: string,
    @Query('time') time: string,
    @Query('duration') duration: string,
    @Query('parking_lot_id') parkingLotId: string,
  ) {
    return await this.slotService.getAvailableSlots(
      date,
      time,
      duration,
      parkingLotId,
    );
  }

  @Post()
  @ApiOperation({summary: 'Add slot (admin only)'})
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async addSlot(@Body() slot: CreateSlotDto) {
    return await this.slotService.addSlot(slot);
  }

  @Put(':id')
  @ApiOperation({summary: 'Update slot (admin only)'})
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async updateSlot(@Body() slot: UpdateSlotDto, @Param('id') slotId: string) {
    return await this.slotService.updateSlot(slot, slotId);
  }
}
