import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDto, UpdateReviewDto } from 'src/dtos/Review.dto';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsRepository {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllReviews() {
    const allReviews = await this.reviewsRepository.find({
      relations: { user: true },
    });
    if (allReviews.length === 0)
      throw new NotFoundException('Reviews not found');
    const reviewsToReturn = [];
    const updatedReviews = allReviews.reverse().map((review) => {
      if (reviewsToReturn.length < 3) {
        reviewsToReturn.push({
          id: review.id,
          message: review.message,
          rating: review.rating,
          user: {
            id: review.user.id,
            name: review.user.name,
            email: review.user.email,
            image: review.user.image,
          },
        });
      } else {
        return;
      }
    });
    return reviewsToReturn;
  }

  async getReviewById(id: string) {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!review) throw new NotFoundException('Review not found');
    return {
      id: review.id,
      message: review.message,
      rating: review.rating,
      user: {
        id: review.user.id,
        name: review.user.name,
        email: review.user.email,
        image: review.user.image,
      },
    };
  }
  async createReview(review: CreateReviewDto) {
    const foundUser = await this.userRepository.findOne({
      where: { id: review.user_id },
    });
    if (!foundUser) throw new NotFoundException('User not found');

    const newReview = new Review();
    newReview.message = review.message || 'Create a new review';
    newReview.rating = review.rating;
    newReview.user = foundUser;
    const savedReview = await this.reviewsRepository.save(newReview);
    if (!savedReview) throw new BadRequestException('Error saving review');

    const createdReview = await this.reviewsRepository.findOne({
      where: { id: savedReview.id },
      relations: { user: true },
    });
    return {
      id: createdReview.id,
      message: createdReview.message,
      rating: createdReview.rating,
      user: {
        id: createdReview.user.id,
        name: createdReview.user.name,
        email: createdReview.user.email,
        image: createdReview.user.image,
      },
    };
  }

  async updateReview(id: string, review: UpdateReviewDto) {
    const foundReview = await this.reviewsRepository.findOne({
      where: { id },
    });
    if (!foundReview) throw new NotFoundException('Review not found');
    const updatedReview = await this.reviewsRepository.update(id, review);
    if (!updatedReview) throw new BadRequestException('Error updating review');
    const reviewAfterUpdate = await this.reviewsRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    return {
      id: reviewAfterUpdate.id,
      message: reviewAfterUpdate.message,
      rating: reviewAfterUpdate.rating,
      user: {
        id: reviewAfterUpdate.user.id,
        name: reviewAfterUpdate.user.name,
        email: reviewAfterUpdate.user.email,
        image: reviewAfterUpdate.user.image,
      },
    };
  }

  async removeReview(id: string) {
    const foundReview = await this.reviewsRepository.findOne({
      where: { id },
    });
    if (!foundReview) throw new NotFoundException('Review not found');
    const deletedReview = await this.reviewsRepository.delete(id);
    if (!deletedReview) throw new BadRequestException('Error deleting review');

    return 'Review deleted successfully';
  }
}
