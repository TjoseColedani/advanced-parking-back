import { Injectable } from '@nestjs/common';
import { ParkingLotRepository } from './parking-lot.repository';

@Injectable()
export class ParkingLotService {
  constructor(private readonly parkingLotRepository: ParkingLotRepository) {}

  addParkingLots() {
    return this.parkingLotRepository.addParkingLots();
  }
}
