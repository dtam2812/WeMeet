import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from 'src/dto/signInUserDto';
import { AuthGuard } from 'src/guard/auth.guard';
import { RefreshTokenDto } from 'src/dto/refreshTokenDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  signIn(@Body() data: SignInUserDto) {
    return this.authService.signIn(data);
  }

  @Post('/refresh')
  refresh(@Body() data: RefreshTokenDto) {
    return this.authService.refreshTokens(data);
  }

  @Post('/logout')
  logout(@Body() data: RefreshTokenDto) {
    return this.authService.logout(data);
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
