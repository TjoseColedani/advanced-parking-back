import { Injectable } from '@nestjs/common';
import { SlotRepository } from './slot.repository';
import { CreateSlotDto, UpdateSlotDto } from 'src/dtos/Slot.dto';

@Injectable()
export class SlotService {
  constructor(private readonly slotRepository: SlotRepository) {}
  async slotSeeder() {
    return await this.slotRepository.slotSeeder();
  }

  async addSlot(slot: CreateSlotDto) {
    return await this.slotRepository.addSlot(slot);
  }

  async updateSlot(slot: UpdateSlotDto, slotId: string) {
    return await this.slotRepository.updateSlot(slot, slotId);
  }

  async getAvailableSlots(
    date: string,
    time: string,
    duration: string,
    parkingLotId: string,
  ) {
    return await this.slotRepository.getAvailableSlots(
      date,
      time,
      duration,
      parkingLotId,
    );
  }
}
