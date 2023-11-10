import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove all the properties that are not part of the DTO
      transform: true, // transform the incoming data to the DTO type
    }),
  );
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
