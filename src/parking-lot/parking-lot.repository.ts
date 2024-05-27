import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParkingLot } from 'src/entities/parkingLot.entity';
import { Repository } from 'typeorm';
import * as data from '../parking-lot-data.json';
import {
  CreateParkingLotDto,
  UpdateParkingLotDto,
} from 'src/dtos/ParkingLot.dto';
import { SlotRepository } from 'src/slot/slot.repository';

@Injectable()
export class ParkingLotRepository {
  constructor(
    @InjectRepository(ParkingLot)
    private readonly parkingLotRepository: Repository<ParkingLot>,
    private readonly slotRepository: SlotRepository,
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
        where: { status: 'active' },
        relations: { slot: true },
        skip: offset,
        take: limit,
      });
    } else {
      return await this.parkingLotRepository.find({
        where: { status: 'active' },
        relations: { slot: true },
      });
    }
  }

  async getAllParkingLots(page?: number, limit?: number) {
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
    newParkingLot.slots_stock = 0;
    newParkingLot.lat = parkingLot.lat;
    newParkingLot.lng = parkingLot.lng;
    newParkingLot.status = 'active';

    const createdParkingLot =
      await this.parkingLotRepository.save(newParkingLot);
    if (!createdParkingLot)
      throw new BadRequestException('Parking lot created');
    for (let i = 0; i < parkingLot.slot_stock; i++) {
      await this.slotRepository.addSlot({
        parking_lot_id: createdParkingLot.id,
      });
    }
    const updatedParkingLot = await this.parkingLotRepository.findOne({
      where: { id: createdParkingLot.id },
      relations: { slot: true },
    });

    return updatedParkingLot;
  }

  async updateParkingLot(
    parkingLot: UpdateParkingLotDto,
    parkingLotId: string,
  ) {
    const parking = await this.parkingLotRepository.findOne({
      where: { id: parkingLotId },
    });
    if (!parking) {
      throw new NotFoundException('Parking lot not found');
    }
    const updatedParkingLot = await this.parkingLotRepository.update(
      parkingLotId,
      parkingLot,
    );
    if (!updatedParkingLot)
      throw new BadRequestException('Error updating parking');

    return `Parking with ID: ${parkingLotId} lot updated successfully`;
  }
  async deleteParkingLot(parkingLotId: string) {
    const parkingLot = await this.parkingLotRepository.findOne({
      where: { id: parkingLotId },
    });
    if (!parkingLot) throw new NotFoundException('Parking lot not found');
    const deletedParkingLot = await this.parkingLotRepository.update(
      parkingLotId,
      {
        status: 'deleted',
      },
    );
    if (!deletedParkingLot)
      throw new BadRequestException('Error to delete parking');

    return `Parking with ID: ${parkingLotId} deleted successfully`;
  }
}
