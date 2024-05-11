import { SlotStatus } from 'src/enums/slot-status.enum';

export class CreateAppointmentDto {
  license_plate: string;
  date: string;
  time: string;
  duration: string;
  is_parked: boolean;
  user_id: string;
  parkingLotId: string;
}

export class UpdateAppointmentDto {
  license_plate?: string;
  date?: string;
  time?: string;
  duration?: string;
  is_parked?: boolean;
  user_id?: string;
  parkingLotId?: string;
  slot_status?: SlotStatus;
}
