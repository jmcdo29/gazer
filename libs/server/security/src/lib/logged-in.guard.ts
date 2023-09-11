import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

import { ServerSecurityService } from './server-security.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private readonly service: ServerSecurityService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx
      .switchToHttp()
      .getRequest<FastifyRequest & { user: { id: string } }>();
    const sessionTokenHeaderVal = req.headers['authorization'];
    if (!sessionTokenHeaderVal || !sessionTokenHeaderVal.split(' ').length) {
      return false;
    }
    const user = await this.service.findUserFromSessionToken(
      sessionTokenHeaderVal.split(' ')[1]
    );
    if (!user) {
      return false;
    }
    req.user = user;
    return true;
  }
}
