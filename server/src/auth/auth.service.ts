import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from 'src/dto/refreshTokenDto';
import { SignInUserDto } from 'src/dto/signInUserDto';
import { PrismaService } from 'src/prisma.service';
import { comparePassword } from 'src/utils/hashing';
import { generateRefreshToken, hashToken } from 'src/utils/token';
import type { StringValue } from 'ms';

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

    return this.issueTokens(user.id, user.email, user.name, user.imageUrl);
  }

  async refreshTokens(dto: RefreshTokenDto) {
    const tokenHash = hashToken(dto.refreshToken);

    const record = await this.prismaService.refreshToken.findUnique({
      where: { token: tokenHash },
    });

    if (!record || record.revoked || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prismaService.refreshToken.update({
      where: { id: record.id },
      data: { revoked: true },
    });

    const user = await this.prismaService.user.findUnique({
      where: { id: record.userId },
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return this.issueTokens(user.id, user.email, user.name, user.imageUrl);
  }

  async logout(dto: RefreshTokenDto) {
    const tokenHash = hashToken(dto.refreshToken);

    await this.prismaService.refreshToken.updateMany({
      where: { token: tokenHash },
      data: { revoked: true },
    });

    return { message: 'Logged out successfully' };
  }

  private async issueTokens(
    userId: string,
    email: string,
    name: string,
    imageUrl: string | null,
  ) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
        name,
        imageUrl,
      },
      {
        expiresIn: (process.env.JWT_ACCESS_EXPIRES ?? '15m') as StringValue,
      },
    );

    const rawRefreshToken = generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS ?? 7),
    );

    await this.prismaService.refreshToken.create({
      data: {
        token: hashToken(rawRefreshToken),
        userId,
        expiresAt,
      },
    });
    return { accessToken, refreshToken: rawRefreshToken };
  }
}
