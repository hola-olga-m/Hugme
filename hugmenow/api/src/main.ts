import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  // Enhanced CORS configuration
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:5000', process.env.FRONTEND_URL || '*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
    exposedHeaders: 'Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API Info available at: http://localhost:${port}/info`);
  console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
}

bootstrap();