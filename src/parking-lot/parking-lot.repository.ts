import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParkingLot } from 'src/entities/parkingLot.entity';
import { Repository } from 'typeorm';
import * as data from '../parking-lot-data.json';

@Injectable()
export class ParkingLotRepository {
  constructor(
    @InjectRepository(ParkingLot)
    private readonly parkingLotRepository: Repository<ParkingLot>,
  ) {}

  async addParkingLots() {
    await Promise.all(
      data.map(async (item) => {
        await this.parkingLotRepository
          .createQueryBuilder()
          .insert()
          .into(ParkingLot)
          .values({
            name: item.name,
            location: item.location,
            slots_stock: item.slots_stock,
          })
          .execute();
      }),
    );
  }
}
