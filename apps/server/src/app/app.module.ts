import { FolderModule } from '@gazer/server/folder';
import { ImageModule } from '@gazer/server/image';
import { ValidationPipe } from '@nest-lab/typeschema';
import { Logger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { OgmaInterceptor, OgmaModule } from '@ogma/nestjs-module';
import { FastifyParser } from '@ogma/platform-fastify';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    OgmaModule.forRoot({
      application: 'Gazer Server',
      logLevel: 'VERBOSE',
    }),
    ImageModule,
    FolderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    FastifyParser,
    Logger,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: OgmaInterceptor,
    },
  ],
})
export class AppModule {}
