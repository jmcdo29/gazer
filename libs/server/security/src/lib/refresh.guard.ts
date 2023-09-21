import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

import { ServerSecurityService } from './server-security.service';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private readonly service: ServerSecurityService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx
      .switchToHttp()
      .getRequest<
        FastifyRequest & { user: { id: string; refreshToken: string } }
      >();
    const refreshTokenHeaderVal = req.headers['authorization'];
    if (!refreshTokenHeaderVal || !refreshTokenHeaderVal.split(' ').length) {
      return false;
    }
    const refreshToken = refreshTokenHeaderVal.split(' ')[1];
    const user = await this.service.findUserFromRefreshToken(refreshToken);
    if (!user) {
      return false;
    }
    req.user = { ...user, refreshToken };
    return true;
  }
}
