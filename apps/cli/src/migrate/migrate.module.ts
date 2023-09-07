import { Module } from '@nestjs/common';
import { MigrateCommand } from './migrate.command';
import { OgmaModule } from '@ogma/nestjs-module';
import { KyselyModule } from '@gazer/server/kysely';

@Module({
  imports: [KyselyModule, OgmaModule.forFeature(MigrateCommand)],
  providers: [MigrateCommand],
})
export class MigrateModule {}
