"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostGraphileProvider = exports.POSTGRAPHILE_POOL = void 0;
const config_1 = require("@nestjs/config");
const pg_1 = require("pg");
exports.POSTGRAPHILE_POOL = 'POSTGRAPHILE_POOL';
exports.PostGraphileProvider = {
    provide: exports.POSTGRAPHILE_POOL,
    inject: [config_1.ConfigService],
    useFactory: (configService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        return new pg_1.Pool({
            connectionString: databaseUrl,
        });
    },
};
//# sourceMappingURL=postgraphile.provider.js.map