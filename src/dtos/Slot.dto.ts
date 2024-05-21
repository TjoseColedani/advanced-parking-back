import { IsNotEmpty, IsString } from 'class-validator';
import { SlotStatus } from 'src/enums/slot-status.enum';

export class CreateSlotDto {
  @IsString()
  @IsNotEmpty()
  parking_lot_id: string;
}

export class UpdateSlotDto {
  @IsString()
  @IsNotEmpty()
  slot_status: SlotStatus;
}
