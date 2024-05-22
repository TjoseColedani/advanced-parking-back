import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Slot } from 'src/entities/slot.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { ParkingLot } from 'src/entities/parkingLot.entity';
import { SlotStatus } from 'src/enums/slot-status.enum';
import { CreateSlotDto, UpdateSlotDto } from 'src/dtos/Slot.dto';
import { Appointment } from 'src/entities/appointment.entity';

@Injectable()
export class SlotRepository {
  constructor(
    @InjectRepository(Slot) private readonly slotRepository: Repository<Slot>,
    @InjectRepository(ParkingLot)
    private readonly parkingLotRepository: Repository<ParkingLot>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  private convertToDateTime(date: string, time: string): Date {
    const [day, month, year] = date
      .split('/')
      .map((part) => parseInt(part, 10));
    const [hours, minutes] = time.split(':').map((part) => parseInt(part, 10));
    return new Date(year, month - 1, day, hours, minutes);
  }
  async slotSeeder() {
    const parkingLots = await this.parkingLotRepository.find();

    await Promise.all(
      parkingLots?.map(async (parkingLot) => {
        for (let i = 0; i < 20; i++) {
          const slot = new Slot();
          slot.slot_status = 'available' as SlotStatus;
          slot.slot_number = i + 1;
          slot.parking_lot = parkingLot;
          await this.slotRepository.save(slot);
        }
      }),
    );
    return 'Products added successfully';
  }

  async getAvailableSlots(
    date: string,
    time: string,
    duration: string,
    parkingLotId: string,
  ) {
    if (!date || !time || !duration || !parkingLotId)
      throw new BadRequestException('Missing information');

    const startTime = this.convertToDateTime(date, time);
    const durationInMinutes = parseInt(duration) * 60;
    const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);

    const parking = await this.parkingLotRepository.findOne({
      where: { id: parkingLotId },
    });
    if (!parking) throw new NotFoundException('Parking lot not found');

    const allSlots = await this.slotRepository.find({
      where: {
        parking_lot: parking,
      },
    });
    if (!allSlots) throw new NotFoundException('Slots not found');

    const reservations = await this.appointmentRepository.find({
      where: {
        start_time: LessThan(endTime),
        end_time: MoreThan(startTime),
        parking_lot: parking,
      },
      relations: ['slot'],
    });
    // if (!reservations) throw new NotFoundException('Reservations not found');

    const updatedSlots = allSlots.map((slot) => {
      if (reservations.some((appointment) => appointment.slot.id === slot.id)) {
        slot.slot_status = SlotStatus.Unavailable;
      } else {
        slot.slot_status = SlotStatus.Available;
      }
    });
    return updatedSlots;
  }

  async updateSlot(slot: UpdateSlotDto, slotId: string) {
    console.log(slot);
    const slotFound = await this.slotRepository.findOne({
      where: { id: slotId },
    });
    if (!slotFound) {
      throw new NotFoundException('Slot not found');
    }
    try {
      await this.slotRepository.update(slotId, {
        slot_status: slot.slot_status,
      });
      return 'Slot updated successfully';
    } catch {
      throw new BadRequestException('error while updating slot');
    }
  }

  async addSlot(slot: CreateSlotDto) {
    const parkingLot = await this.parkingLotRepository.findOne({
      where: { id: slot.parking_lot_id },
      relations: { slot: true },
    });
    if (!parkingLot) {
      throw new NotFoundException('Parking lot not found');
    }
    const slotList = await this.slotRepository.find({
      where: { parking_lot: parkingLot },
    });
    const prevSlotNumber = slotList.length;

    const newSlot = new Slot();
    newSlot.slot_status = SlotStatus.Available;
    newSlot.parking_lot = parkingLot;
    newSlot.slot_number = prevSlotNumber + 1;

    const createdSlot = await this.slotRepository.save(newSlot);
    if (!createdSlot) throw new BadRequestException('Error saving slot');
    await this.parkingLotRepository.update(parkingLot.id, {
      slots_stock: parkingLot.slots_stock + 1,
    });
    return { message: 'Slot created', createdSlot };
  }
}
