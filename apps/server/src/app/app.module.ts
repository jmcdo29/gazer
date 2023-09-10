import { ImageModule } from '@gazer/server/image';
import { Logger, Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nest-lab/typeschema';
import { OgmaModule } from '@ogma/nestjs-module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    OgmaModule.forRoot({
      application: 'Gazer Server',
      logLevel: 'SILLY',
    }),
    ImageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
