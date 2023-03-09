import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { returnCategoryObject } from '../category/return-category.object';
import { CategoryDto } from '../category/category.dto';
import { generateSlug } from '../utils/generate-slug';
import { returnReviewObject } from './return-review.object';
import { ReviewDto } from './review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  // async byId(id: number) {
  //   const review = await this.prisma.review.findUnique({
  //     where: { id },
  //     select: returnReviewObject,
  //   });
  //
  //   if (!review) {
  //     throw new NotFoundException('Review not found');
  //   }
  //
  //   return review;
  // }

  async getAll() {
    return this.prisma.review.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: returnReviewObject,
    });
  }

  async create(userId: number, dto: ReviewDto, productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    console.log(product);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.review.create({
      data: {
        ...dto,
        product: {
          connect: {
            id: productId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getAverageValueProductId(productId: number) {
    return this.prisma.review
      .aggregate({
        where: { productId },
        _avg: { rating: true },
      })
      .then((data) => data._avg);
  }
}
