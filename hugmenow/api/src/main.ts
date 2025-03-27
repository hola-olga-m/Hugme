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
  
  // Enhanced CORS configuration - Allow ALL origins for debugging
  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, Accept-Protocol, Connection, X-Protocol-Hint, X-Client-Version, X-Retry-Attempt, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers',
    exposedHeaders: 'Authorization, Accept-Protocol, X-Protocol-Used, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers',
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
    
    // Set HTTP protocol compatibility header to avoid 426 errors
    res.setHeader('X-Protocol-Compatibility', 'HTTP/1.1');
    
    // Handle protocol upgrade attempts specifically
    const upgradeHeader = req.headers.upgrade;
    if (upgradeHeader && typeof upgradeHeader === 'string' && upgradeHeader.toLowerCase().includes('http')) {
      console.log(`Protocol upgrade requested: ${upgradeHeader}`);
      
      // Instead of returning 426, we'll accept the request with current protocol
      res.setHeader('X-Protocol-Handler', 'compatibility-mode');
    }
    
    // Handle 426 errors with special response
    if (req.headers['x-retry-attempt']) {
      const retryAttempt = parseInt(req.headers['x-retry-attempt'] as string) || 1;
      console.log(`Request retry attempt ${retryAttempt} with protocol compatibility headers`);
      
      // Add information about retry status
      res.setHeader('X-Retry-Status', 'accepted');
      res.setHeader('X-Protocol-Version', 'HTTP/1.1');
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