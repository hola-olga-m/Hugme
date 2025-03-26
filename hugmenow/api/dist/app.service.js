"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
let AppService = class AppService {
    getHello() {
        return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hug Me Now</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          color: #333;
        }
        .container {
          background-color: white;
          border-radius: 20px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          padding: 2.5rem;
          max-width: 600px;
          width: 90%;
          text-align: center;
          animation: fadeIn 0.8s ease-in-out;
        }
        h1 {
          color: #6C63FF;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        p {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }
        .button-container {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }
        .btn {
          display: inline-block;
          background-color: #6C63FF;
          color: white;
          padding: 0.8rem 1.5rem;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.3s, box-shadow 0.3s;
          box-shadow: 0 4px 6px rgba(108, 99, 255, 0.2);
        }
        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 7px 14px rgba(108, 99, 255, 0.3);
        }
        .btn-secondary {
          background-color: white;
          color: #6C63FF;
          border: 2px solid #6C63FF;
        }
        .features {
          display: flex;
          justify-content: space-around;
          margin-top: 2.5rem;
          flex-wrap: wrap;
        }
        .feature {
          flex-basis: 30%;
          min-width: 150px;
          margin-bottom: 1.5rem;
        }
        .feature-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #6C63FF;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 600px) {
          .container {
            padding: 1.5rem;
          }
          h1 {
            font-size: 2rem;
          }
          .button-container {
            flex-direction: column;
            gap: 0.8rem;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Hug Me Now</h1>
        <p>
          Hug Me Now is a platform designed for emotional wellness, offering virtual hugs and mood tracking to support your mental health journey.
        </p>
        <div class="features">
          <div class="feature">
            <div class="feature-icon">❤️</div>
            <div>Virtual Hugs</div>
          </div>
          <div class="feature">
            <div class="feature-icon">📊</div>
            <div>Mood Tracking</div>
          </div>
          <div class="feature">
            <div class="feature-icon">🤝</div>
            <div>Support Network</div>
          </div>
        </div>
        <div class="button-container">
          <a href="/register" class="btn">Register</a>
          <a href="/login" class="btn btn-secondary">Login</a>
        </div>
      </div>
    </body>
    </html>
    `;
    }
    getAppInfo() {
        return {
            name: 'Hug Me Now',
            version: '1.0.0',
            description: 'A platform for emotional wellness through virtual hugs and mood tracking',
            endpoints: {
                graphql: '/graphql',
                api: '/api',
            },
            paths: {
                login: '/login',
                register: '/register',
                dashboard: '/dashboard',
                moodTracker: '/mood-tracker',
                hugCenter: '/hug-center',
                profile: '/profile',
                info: '/info',
            },
            features: [
                'User authentication with JWT',
                'Mood tracking and history',
                'Virtual hugs exchange',
                'Hug requests',
                'Public and private mood sharing',
            ],
            status: 'online',
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map