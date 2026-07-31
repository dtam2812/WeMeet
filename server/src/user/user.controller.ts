import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dto/createUserDto';
import { SignInUserDto } from 'src/dto/signInUserDto';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async findAll() {
    return this.userService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Post('/sign-up')
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  update(
    @Body() data: CreateUserDto,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    if (req.user.sub !== id) {
      throw new ForbiddenException('You can only update your own account');
    }
    return this.userService.update(data, id);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  delete(@Param('id') id: string, @Req() req: any) {
    if (req.user.sub !== id) {
      throw new ForbiddenException('You can only delete your own account');
    }
    return this.userService.delete(id);
  }
}
