import { Controller, Get } from '@nestjs/common';
import { SlotService } from './slot.service';

@Controller('slot')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Get('seeder')
  async slotSeeder() {
    return await this.slotService.slotSeeder();
  }
}
