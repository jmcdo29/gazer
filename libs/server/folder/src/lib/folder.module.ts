import { Module } from '@nestjs/common';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { KyselyModule } from '@gazer/server/kysely';
import { ServerSecurityModule } from '@gazer/server/security';

@Module({
  imports: [KyselyModule, ServerSecurityModule],
  controllers: [FolderController],
  providers: [FolderService],
  exports: [],
})
export class FolderModule {}
