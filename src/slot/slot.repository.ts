import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Slot } from 'src/entities/slot.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SlotRepository {
  constructor(
    @InjectRepository(Slot) private readonly slotRepository: Repository<Slot>,
  ) {}

  async slotSeeder() {
    // const slot = new Slot();
    // slot.id = '1';
    // slot.parking_lot= ;
    // await this.slotRepository.save(slot);
    return 'cargando datos de slots';
  }
}
