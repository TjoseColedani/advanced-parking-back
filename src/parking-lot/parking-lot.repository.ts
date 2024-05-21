import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParkingLot } from 'src/entities/parkingLot.entity';
import { Repository } from 'typeorm';
import * as data from '../parking-lot-data.json';
import { CreateParkingLotDto } from 'src/dtos/ParkingLot.dto';

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
            lat: item.lat,
            lng: item.lng,
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
      relations: { slot: true, appointments: true },
    });

    if (!parkingLotById) {
      throw new NotFoundException('Parking lot not found');
    }

    return parkingLotById;
  }

  async createParkingLot(parkingLot: CreateParkingLotDto) {
    const newParkingLot = new ParkingLot();
    newParkingLot.name = parkingLot.name;
    newParkingLot.location = parkingLot.location;
    newParkingLot.slots_stock = parkingLot.slot_stock;
    newParkingLot.lat = parkingLot.lat;
    newParkingLot.lng = parkingLot.lng;

    const createdParkingLot =
      await this.parkingLotRepository.save(newParkingLot);
    if (!createdParkingLot)
      throw new BadRequestException('Parking lot created');
    return createdParkingLot;
  }
}
