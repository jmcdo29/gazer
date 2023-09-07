import { Module } from '@nestjs/common';
import { MigrateModule } from '../migrate/migrate.module';
import { OgmaModule } from '@ogma/nestjs-module';

@Module({
  imports: [
    MigrateModule,
    OgmaModule.forRoot({
      application: 'Gazer CLI',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
