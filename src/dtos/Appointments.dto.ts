export class CreateAppointmentDto {
  license_plate: string;
  date: string;
  time: string;
  duration: string;
  is_parked: boolean;
  user_id: string;
  parkingLotId: string;
}
