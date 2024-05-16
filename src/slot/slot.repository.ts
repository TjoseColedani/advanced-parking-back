import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Slot } from 'src/entities/slot.entity';
import { Repository } from 'typeorm';
import * as data from '../slot-data.json';
import { ParkingLot } from 'src/entities/parkingLot.entity';
import { SlotStatus } from 'src/enums/slot-status.enum';

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
}
