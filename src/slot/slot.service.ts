import { Injectable } from '@nestjs/common';
import { SlotRepository } from './slot.repository';

@Injectable()
export class SlotService {
  constructor(private readonly slotRepository: SlotRepository) {}
  async slotSeeder() {
    return await this.slotRepository.slotSeeder();
  }
}
