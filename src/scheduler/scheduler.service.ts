import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as cron from 'node-cron';
import { Appointment } from 'src/entities/appointment.entity';
import { Slot } from 'src/entities/slot.entity';
import { SlotStatus } from 'src/enums/slot-status.enum';
import { ParkingLot } from 'src/entities/parkingLot.entity';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Slot)
    private readonly slotRepository: Repository<Slot>,
    @InjectRepository(ParkingLot)
    private readonly parkingLotRepository: Repository<ParkingLot>,
  ) {}

  handleCron() {
    cron.schedule('* * * * *', async () => {
      const now = new Date();
      const expiredAppointments = await this.appointmentRepository.find({
        where: {
          end_time: LessThan(now),
          status: 'active',
        },
        relations: ['slot'],
      });

      for (const appointment of expiredAppointments) {
        await this.slotRepository.update(appointment.slot.id, {
          slot_status: SlotStatus.Available,
        });
        await this.appointmentRepository.update(appointment.id, {
          status: 'deleted',
        });

        await this.parkingLotRepository.update(appointment.parking_lot.id, {
          slots_stock: appointment.parking_lot.slots_stock + 1,
        });
      }

      const startedAppointments = await this.appointmentRepository.find({
        where: {
          start_time: LessThan(now),
          status: 'active',
        },
      });

      for (const appointment of startedAppointments) {
        await this.slotRepository.update(appointment.slot.id, {
          slot_status: SlotStatus.Unavailable,
        });
        await this.parkingLotRepository.update(appointment.parking_lot.id, {
          slots_stock: appointment.parking_lot.slots_stock - 1,
        });
      }
    });
  }
}
