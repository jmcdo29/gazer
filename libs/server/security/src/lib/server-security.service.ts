import { randomBytes } from 'node:crypto';

import { Database, InjectKysely } from '@gazer/server/kysely';
import { User } from '@gazer/shared/types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';
import { Kysely, sql } from 'kysely';

import { Login } from './models/login.dto';

@Injectable()
export class ServerSecurityService {
  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async login(login: Login) {
    const user = await this.db
      .selectFrom('userAccount')
      .select(['password', 'id'])
      .where('email', '=', login.email)
      .executeTakeFirst();
    if (!user?.id || !(await verify(user.password, login.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const sessionToken = this.createToken();
    const refreshToken = this.createToken('refresh');

    await this.db
      .insertInto('token')
      .columns(['type', 'value', 'userId', 'expiresAt'])
      .values([
        {
          type: 'session',
          value: sessionToken,
          userId: user.id,
          expiresAt: sql`NOW() + '1 DAY'`,
        },
        {
          type: 'refresh',
          value: refreshToken,
          userId: user.id,
          expiresAt: sql`NOW() + '7 DAY'`,
        },
      ])
      .execute();
    return { sessionToken, refreshToken, id: user.id };
  }

  async findUserFromSessionToken(
    sessionToken: string
  ): Promise<Pick<User, 'id'> | undefined> {
    return this.findUserFromToken(sessionToken, 'session');
  }

  async findUserFromRefreshToken(
    refreshToken: string
  ): Promise<Pick<User, 'id'> | undefined> {
    return this.findUserFromToken(refreshToken, 'refresh');
  }

  private findUserFromToken(
    token: string,
    tokenType: 'session' | 'refresh'
  ): Promise<Pick<User, 'id'> | undefined> {
    return this.db
      .selectFrom('token')
      .innerJoin('userAccount', 'token.userId', 'userAccount.id')
      .select('userAccount.id')
      .where('value', '=', token)
      .where('type', '=', tokenType)
      .where('expiresAt', '>', sql`NOW()`)
      .executeTakeFirst();
  }

  async createNewSessionToken(user: {
    id: string;
    refreshToken: string;
  }): Promise<{ sessionToken: string; refreshToken: string }> {
    const sessionToken = this.createToken();
    await this.db
      .insertInto('token')
      .columns(['type', 'value', 'userId'])
      .values({
        type: 'session',
        value: sessionToken,
        userId: user.id,
      })
      .execute();
    const willExpireSoon = await this.db
      .selectFrom('token')
      .select(() => [
        sql<boolean>`expires_at < NOW() + '2 DAY`.as('expiresSoon'),
      ])
      .where('type', '=', 'refresh')
      .where('value', '=', user.refreshToken)
      .executeTakeFirst();
    if (willExpireSoon?.expiresSoon) {
      user.refreshToken = this.createToken('refresh');
      await this.db
        .insertInto('token')
        .columns(['type', 'value', 'userId'])
        .values({
          type: 'refresh',
          value: user.refreshToken,
          userId: user.id,
        })
        .execute();
    }
    return { sessionToken, refreshToken: user.refreshToken };
  }

  private createToken(type: 'session' | 'refresh' = 'session'): string {
    return randomBytes(type === 'session' ? 32 : 64).toString('hex');
  }
}
