import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getParkingLots(page?: number, limit?: number) {
    if (page !== undefined && limit !== undefined) {
      const offset = (page - 1) * limit;
      return await this.parkingLotRepository.find({
        relations: { slot: true },
        skip: offset,
        take: limit,
      });
    } else {
      return await this.parkingLotRepository.find({
        relations: { slot: true },
      });
    }
  }

  async getParkingLotById(id: string) {
    const parkingLotById = await this.parkingLotRepository.findOne({
      where: { id },
      relations: { slot: true },
    });

    if (!parkingLotById) {
      throw new NotFoundException('Parking lot not found');
    }

    return parkingLotById;
  }
}
