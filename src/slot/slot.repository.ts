import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Slot } from 'src/entities/slot.entity';
import { Repository } from 'typeorm';
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
    const parkingLots = await this.parkingLotRepository.find();

    await Promise.all(
      parkingLots?.map(async(parkingLot) => {
        for(let i = 0; i < 20; i++) {
          const slot = new Slot();
          slot.slot_status = "available" as SlotStatus;
          slot.slot_number = (i + 1);
          slot.parking_lot = parkingLot;
          await this.slotRepository.save(slot);
        }
      })
    )
    return 'Products added successfully';
  }
}
