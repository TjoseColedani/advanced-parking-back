import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Slot } from 'src/entities/slot.entity';
import { Repository } from 'typeorm';
import * as data from '../slot-data.json';
import { ParkingLot } from 'src/entities/parkingLot.entity';
import { SlotStatus } from 'src/enums/slot-status.enum';
import { CreateSlotDto, UpdateSlotDto } from 'src/dtos/Slot.dto';

@Injectable()
export class SlotRepository {
  constructor(
    @InjectRepository(Slot) private readonly slotRepository: Repository<Slot>,
    @InjectRepository(ParkingLot)
    private readonly parkingLotRepository: Repository<ParkingLot>,
  ) {}

  async slotSeeder() {
    const parkingLot = await this.parkingLotRepository.find();

    await Promise.all(
      data?.map(async (item) => {
        const parking = parkingLot.find(
          (lot) => lot.id === item.parking_lot_id,
        );

        const slot = new Slot();
        slot.slot_status = item.slot_status as SlotStatus;
        slot.parking_lot = parking;

        await this.slotRepository.save(slot);
      }),
    );

    return 'Products added successfully';
  }

  async updateSlot(slot: UpdateSlotDto, slotId: string) {
    const slotFound = await this.slotRepository.findOne({
      where: { id: slotId },
    });
    if (!slotFound) {
      throw new NotFoundException('Slot not found');
    }
    try {
      await this.slotRepository.update(slotFound.id, slot);
      return 'Slot updated successfully';
    } catch {
      throw new BadRequestException('error while updating slot');
    }
  }

  async addSlot(slot: CreateSlotDto) {
    const parkingLot = await this.parkingLotRepository.findOne({
      where: { id: slot.parking_lot_id },
      relations: { slot: true },
    });
    if (!parkingLot) {
      throw new NotFoundException('Parking lot not found');
    }
    const slotList = await this.slotRepository.find({
      where: { parking_lot: parkingLot },
    });
    const prevSlotNumber = slotList.length;

    const newSlot = new Slot();
    newSlot.slot_status = SlotStatus.Available;
    newSlot.parking_lot = parkingLot;
    newSlot.slot_number = prevSlotNumber + 1;

    const createdSlot = await this.slotRepository.save(newSlot);
    if (!createdSlot) throw new BadRequestException('Error saving slot');
    return { message: 'Slot created', createdSlot };
  }
}
