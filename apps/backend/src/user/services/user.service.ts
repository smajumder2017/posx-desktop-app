import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/database/services/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: Prisma.UserCreateInput) {
    user.password = await bcrypt.hash(user.password, 10);
    return this.prismaService.user.create({ data: user });
  }

  getUserById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        userShops: {
          include: {
            shop: true,
          },
        },
      },
    });
  }

  getUserByUserName(userName: string) {
    return this.prismaService.user.findUnique({
      where: { userName },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        userShops: {
          include: {
            shop: true,
          },
        },
      },
    });
  }

  findAllUsers(whereOptions: Prisma.UserFindManyArgs) {
    return this.prismaService.user.findMany(whereOptions);
  }
}
