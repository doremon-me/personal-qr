import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  logger: new ConsoleLogger({
    colors: true,
    timestamp: true,
    logLevels: ['log', 'error', 'warn', 'debug', 'verbose'],
    prefix: 'Personal QR',
    json: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  console.log('app is listening on port', process.env.PORT ?? 3000);
}
bootstrap();
