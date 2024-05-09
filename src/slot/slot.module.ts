import { Module } from '@nestjs/common';
import { SlotController } from './slot.controller';
import { SlotService } from './slot.service';
import { SlotRepository } from './slot.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from 'src/entities/slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slot])],
  controllers: [SlotController],
  providers: [SlotService, SlotRepository],
})
export class SlotModule {}
