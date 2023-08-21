import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LibraryLogger } from './logger/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LibraryLogger(),
  });
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
