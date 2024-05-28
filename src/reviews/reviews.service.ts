import { Injectable } from '@nestjs/common';
import { CreateReviewDto, UpdateReviewDto } from 'src/dtos/Review.dto';
import { ReviewsRepository } from './reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}
  async create(createReviewDto: CreateReviewDto) {
    return await this.reviewsRepository.createReview(createReviewDto);
  }

  async findAll() {
    return await this.reviewsRepository.getAllReviews();
  }

  async findOne(id: string) {
    return await this.reviewsRepository.getReviewById(id);
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    return await this.reviewsRepository.updateReview(id, updateReviewDto);
  }

  async remove(id: string) {
    return await this.reviewsRepository.removeReview(id);
  }
}
