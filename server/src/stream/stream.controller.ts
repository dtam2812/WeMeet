import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { StreamService } from './stream.service';
import { AuthGuard } from 'src/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Get('/token')
  getToken(@Req() req: any) {
    const token = this.streamService.genarateUserToken(req.user.sub);
    return { token };
  }
}
