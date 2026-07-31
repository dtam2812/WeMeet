import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInUserDto } from 'src/dto/signInUserDto';
import { PrismaService } from 'src/prisma.service';
import { comparePassword } from 'src/utils/hashing';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(data: SignInUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email address or password');
    }

    const isMatched = comparePassword(data.password, user.password);
    if (!isMatched)
      throw new UnauthorizedException('Invalid email address or password');

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
      },
      { expiresIn: '1d' },
    );

    return accessToken;
  }
}
