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
    allowedHeaders: 'Content-Type, Accept, Authorization, Accept-Protocol, Connection, X-Protocol-Hint, X-Client-Version, X-Retry-Attempt',
    exposedHeaders: 'Authorization, Accept-Protocol, X-Protocol-Used',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  
  // Add middleware to handle protocol compatibility headers
  app.use((req, res, next) => {
    // Add protocol compatibility headers to all responses
    res.setHeader('Connection', 'keep-alive');
    
    // Check for protocol compatibility headers in request
    if (req.headers['accept-protocol'] || req.headers['x-protocol-hint']) {
      // Client is requesting specific protocol compatibility
      res.setHeader('Vary', 'Accept-Protocol, X-Protocol-Hint');
      
      // Acknowledge the requested protocol
      if (req.headers['accept-protocol']) {
        res.setHeader('X-Protocol-Used', req.headers['accept-protocol']);
      }
    }
    
    next();
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API Info available at: http://localhost:${port}/info`);
  console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
}

bootstrap();