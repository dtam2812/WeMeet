import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/createUserDto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.user.findMany({
      omit: { password: true },
    });
  }

  findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
      omit: { password: true },
    });
  }

  create(userData: CreateUserDto) {
    return this.prismaService.user.create({
      data: {
        ...userData,
        password: hashPassword(userData.password),
      },
      omit: {
        password: true,
      },
    });
  }

  async update(userData: CreateUserDto, id: string) {
    try {
      const dataUpdate = { ...userData };
      if (userData.password)
        dataUpdate.password = hashPassword(userData.password);

      return await this.prismaService.user.update({
        where: { id },
        data: dataUpdate,
        omit: { password: true },
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async delete(id: string) {
    try {
      return await this.prismaService.user.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
