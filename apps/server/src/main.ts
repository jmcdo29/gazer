import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';

import { AppModule } from './app/app.module';
import { OgmaService } from '@ogma/nestjs-module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter(), {
    bufferLogs: true,
  });
  const logger = app.get(OgmaService);
  app.useLogger(logger);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
