import { Injectable } from '@nestjs/common';
import { ParkingLotRepository } from './parking-lot.repository';
import { CreateParkingLotDto } from 'src/dtos/ParkingLot.dto';

@Injectable()
export class ParkingLotService {
  constructor(private readonly parkingLotRepository: ParkingLotRepository) {}

  addParkingLots() {
    return this.parkingLotRepository.addParkingLots();
  }

  getParkingLots(page?: number, limit?: number) {
    return this.parkingLotRepository.getParkingLots(page, limit);
  }

  getParkingLotById(id: string) {
    return this.parkingLotRepository.getParkingLotById(id);
  }

  async createParkingLot(parkingLot: CreateParkingLotDto) {
    return await this.parkingLotRepository.createParkingLot(parkingLot);
  }
}
