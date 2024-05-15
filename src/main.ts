import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true
  });
  app.enableCors();
  app.use(morgan('dev'));

  const swaggerConfig = new DocumentBuilder()
    .setTitle(`Advanced-Parking App`)
    .setDescription(`This is the Advanced Parking Web!`)
    .setVersion(`1.0`)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
