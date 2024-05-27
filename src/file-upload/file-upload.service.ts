import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly fileUploadRepository: FileUploadRepository,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async uploadProfileImage(userId: string, file: Express.Multer.File) {
    const userFound = await this.usersRepository.findOneBy({
      id: userId,
    });
    if (!userFound) throw new NotFoundException('User not found');

    const { secure_url } = await this.fileUploadRepository.uploadImage(file);
    if (!secure_url)
      throw new BadRequestException('Error uploading profile image');

    await this.usersRepository.update(userId, {
      image: secure_url,
    });
    const updatedUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      select: ['id', 'name', 'email', 'image', 'phone'],
    });

    return updatedUser;
  }
  async deleteProfileImage(userId: string) {
    const userFound = await this.usersRepository.findOneBy({
      id: userId,
    });
    if (!userFound) throw new NotFoundException('User not found');
    await this.usersRepository.update(userId, {
      image: null,
    });
    return 'Image deleted successfully';
  }
}
