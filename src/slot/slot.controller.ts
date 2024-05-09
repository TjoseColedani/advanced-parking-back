import { Controller, OnModuleInit } from '@nestjs/common';
import { SlotService } from './slot.service';

@Controller()
export class SlotController implements OnModuleInit {
  constructor(private readonly slotService: SlotService) {}

  async onModuleInit() {
    await this.slotService.slotSeeder();
  }
}
