import { ImageModule } from '@gazer/server/image';
import { ValidationPipe } from '@nest-lab/typeschema';
import { Logger, Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { OgmaModule } from '@ogma/nestjs-module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    OgmaModule.forRoot({
      application: 'Gazer Server',
      logLevel: 'VERBOSE',
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
