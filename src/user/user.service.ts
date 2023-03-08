import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { returnUserObject } from './return-user.object';
import { Prisma } from '@prisma/client';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async byId(id: number, selectObject: Prisma.UserSelect = {}) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...returnUserObject,
        favorites: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            slug: true,
          },
        },
        ...selectObject,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // async updateProfile(id: number, dto: UserDto) {
  //   // const user = await this.byId(id);
  //
  //   // const updatedUser = await this.prisma.user.update({
  //   //   where: { id },
  //   //   data: {
  //   //     ...dto,
  //   //   },
  //   //   select: {
  //   //     ...returnUserObject,
  //   //   },
  //   // });
  //
  //   return updatedUser;
  // }
}
