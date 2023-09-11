import { KyselyModule } from '@gazer/server/kysely';
import { Module } from '@nestjs/common';

import { ServerSecurityController } from './server-security.controller';
import { ServerSecurityService } from './server-security.service';

@Module({
  imports: [KyselyModule],
  controllers: [ServerSecurityController],
  providers: [ServerSecurityService],
  exports: [ServerSecurityService],
})
export class ServerSecurityModule {}
