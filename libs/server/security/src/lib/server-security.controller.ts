import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { LoginDto } from './models/login.dto';
import { RefreshGuard } from './refresh.guard';
import { ServerSecurityService } from './server-security.service';

@Controller('auth')
export class ServerSecurityController {
  constructor(private readonly service: ServerSecurityService) {}

  @Post('login')
  login(@Body() { data }: LoginDto) {
    return this.service.login(data);
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  refreshToken(
    @Req() { user }: { user: { id: string; refreshToken: string } }
  ) {
    return this.service.createNewSessionToken(user);
  }
}
