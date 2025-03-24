"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.enableCors({
        origin: ['http://localhost:3001', 'http://localhost:5000', process.env.FRONTEND_URL || '*'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'Content-Type, Accept, Authorization, Accept-Protocol, Connection, X-Protocol-Hint, X-Client-Version, X-Retry-Attempt',
        exposedHeaders: 'Authorization, Accept-Protocol, X-Protocol-Used',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    app.use((req, res, next) => {
        res.setHeader('Connection', 'keep-alive');
        if (req.headers['accept-protocol'] || req.headers['x-protocol-hint']) {
            res.setHeader('Vary', 'Accept-Protocol, X-Protocol-Hint');
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
//# sourceMappingURL=main.js.map