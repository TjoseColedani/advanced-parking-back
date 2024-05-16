import { Controller, Get } from '@nestjs/common';
import { SlotService } from './slot.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('slot')
@Controller('slot')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Get('seeder')
  async slotSeeder() {
    return await this.slotService.slotSeeder();
  }
}
