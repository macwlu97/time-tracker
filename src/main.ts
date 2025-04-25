import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Time Tracker API')
    .setDescription('API for tracking work time')
    .setVersion('1.0')
    .addBearerAuth() // JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // '/api' is endpoint where docucmentation is located

  await app.listen(3000);
}
bootstrap();
