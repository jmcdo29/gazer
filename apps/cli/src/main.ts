import { CommandFactory } from 'nest-commander';
import { AppModule } from './app/app.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  await CommandFactory.run(AppModule, { logger: new ConsoleLogger() });
}

bootstrap();
