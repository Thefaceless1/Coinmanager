import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000;
  const config = new DocumentBuilder()
      .setTitle('Coinmanager')
      .setDescription('Coinmanager API description')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(port);
}
bootstrap();
