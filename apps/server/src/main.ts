import { ServerConfigService } from '@gazer/server/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { OgmaService } from '@ogma/nestjs-module';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter(), {
    bufferLogs: true,
  });
  const config = app.get(ServerConfigService);
  const logger = app.get(OgmaService);
  app.useLogger(logger);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: config.get('CORS'),
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
