import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AppLogger } from './common/utils/logger.util';

async function bootstrap() {
  const logger = new AppLogger('Bootstrap');
  const port = process.env.PORT || 3000;

  AppLogger.banner('Günlük Burç API');

  logger.log('Uygulama başlatılıyor...');

  const app = await NestFactory.create(AppModule, {
    logger: new AppLogger(),
  });

  logger.log('Güvenlik middleware\'leri uygulanıyor...');
  app.use(helmet());

  logger.log('Doğrulama pipe\'ları yapılandırılıyor...');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  logger.log('Swagger dokümantasyonu hazırlanıyor...');
  const config = new DocumentBuilder()
    .setTitle('Zodiac Daily API')
    .setDescription('Daily Horoscope API')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: 'API Key for authentication',
      },
      'api-key',
    )
    .addTag('zodiac', 'Daily horoscope endpoints')
    .addTag('health', 'Health check endpoint')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  AppLogger.success(`Uygulama çalışıyor: http://localhost:${port}`, 'Bootstrap');
  AppLogger.info(`Swagger dokümantasyonu: http://localhost:${port}/api`, 'Swagger');
  AppLogger.info(`Health check: http://localhost:${port}/health`, 'Health');
  AppLogger.banner('API hazır');
}
bootstrap();
