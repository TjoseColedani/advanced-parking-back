import { Injectable } from '@nestjs/common';
import { ParkingLotRepository } from './parking-lot.repository';
import {
  CreateParkingLotDto,
  UpdateParkingLotDto,
} from 'src/dtos/ParkingLot.dto';

@Injectable()
export class ParkingLotService {
  constructor(private readonly parkingLotRepository: ParkingLotRepository) {}

  async addParkingLots() {
    return await this.parkingLotRepository.addParkingLots();
  }

  async getParkingLots(page?: number, limit?: number) {
    return await this.parkingLotRepository.getParkingLots(page, limit);
  }

  async getParkingLotById(id: string) {
    return this.parkingLotRepository.getParkingLotById(id);
  }

  async createParkingLot(parkingLot: CreateParkingLotDto) {
    return await this.parkingLotRepository.createParkingLot(parkingLot);
  }

  async updateParkingLot(
    parkingLot: UpdateParkingLotDto,
    parkingLotId: string,
  ) {
    return await this.parkingLotRepository.updateParkingLot(
      parkingLot,
      parkingLotId,
    );
  }

  async deleteParkingLot(parkingLotId: string) {
    return await this.parkingLotRepository.deleteParkingLot(parkingLotId);
  }
}
