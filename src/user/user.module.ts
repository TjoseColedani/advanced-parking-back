import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserRepository } from './user.repository';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';
import { EmailSenderRepository } from 'src/email-sender/email-sender.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailSenderModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, EmailSenderRepository],
  exports: [UserRepository],
})
export class UserModule {}
