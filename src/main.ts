import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ cors: true });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('Ticket Service')
    .setDescription('API for managing tickets with BullMQ + Prisma')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log(`API ready at http://localhost:3000`);
  console.log(`Swagger docs at http://localhost:3000/api/docs`);
}
bootstrap();
