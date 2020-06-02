import fs from 'fs';
import dotenv from 'dotenv';
import { configure } from 'log4js';
import { Algorithm } from 'jsonwebtoken';

function initEnv (envFile: string): void {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  } else {
    console.error(`${envFile} file does not exist`);
    process.exit(1);
  }
}

initEnv('.env');

switch (process.env.NODE_ENV) {
  case 'production':
    configure({
      appenders: {
        logstash: {
          type: '@log4js-node/logstashudp',
          host: process.env.LOGSTASH_HOST,
          port: process.env.LOGSTASH_PORT,
        },
      },
      categories: {
        default: { appenders: ['logstash'], level: 'info' },
      },
    });
    break;
  case 'test':
    configure({
      appenders: { console: { type: 'console' } },
      categories: { default: { appenders: [ 'console' ], level: 'info' } },
    });
    break;
  default:
    process.env.NODE_ENV = 'development';
    configure({
      appenders: {
        fatalError: { type: 'file', filename: '../../logs/fatal.log' },
        fileError: { type: 'file', filename: '../../logs/error.log' },
        console: { type: 'console' },
      },
      categories: {
        fatalError: { appenders: ['fatalError'], level: 'fatal' },
        fileError: { appenders: ['fileError'], level: 'error' },
        console: { appenders: ['console'], level: 'trace' },
        default: { appenders: ['console', 'fileError', 'fatalError'], level: 'trace' },
      },
    });
    break;
}

export interface Redis {
  url: string;
  options: object;
}

export interface Postgres {
  url: string;
  options: {
    logging: boolean;
    dialect: 'postgres';
  };
}

export interface MongoDb {
  url: string;
  options: {
    useNewUrlParser: boolean;
    poolSize: number;
    useCreateIndex: boolean;
    useUnifiedTopology: boolean;
    connectTimeoutMS: number;
    socketTimeoutMS: number;
  };
}

export enum Env {
  production = 'production',
  development = 'development',
  test = 'test',
}

export interface Token {
  secret: string;
  algorithm: Algorithm;
  issuer: string;
  expiresIn?: number;
}

export interface Config {
  env: Env | string;
  protocol: string;
  host: string;
  port: number;
  clusterMode: boolean;
  startTimeoutMs: number;
  mongo: MongoDb;
  redis: Redis;
  postgres: Postgres;
  logstash: {
    host: string;
    port: number;
  };
  sequelizeConnectionOptions: object;
  facebookAppId: string;
  facebookAppSecret: string;
  googleAppId: string;
  googleAppSecret: string;
  twitterClientID: string;
  twitterClientSecret: string;
  token: Token;
  swaggerUi: {
    options: {
      swaggerOptions: {
        url: string;
      };
    };
  };
}

export const config: Config = {
  env: process.env.NODE_ENV,
  protocol: process.env.PROTOCOL || '',
  host: process.env.HOST || '',
  // @ts-ignore
  port: +process.env.PORT,
  clusterMode: false,
  startTimeoutMs: 2000,
  mongo: {
    url: process.env.MONGODB_URL || '',
    options: {
      useNewUrlParser: true,
      poolSize: 10,
      useCreateIndex: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 3000, // default 30000
      socketTimeoutMS: 30000, // default 360000
    },
  },
  redis: {
    url: process.env.REDIS_URL || '',
    options: {},
  },
  postgres: {
    url: process.env.POSTGRES_URL || '',
    options: {
      logging: false,
      dialect: 'postgres',
    },
  },
  logstash: {
    host: process.env.LOGSTASH_HOST || '',
    // @ts-ignore
    port: +process.env.LOGSTASH_PORT,
  },
  sequelizeConnectionOptions: {},
  facebookAppId: process.env.FACEBOOK_APP_ID || '',
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET || '',
  googleAppId: process.env.GOOGLE_APP_ID || '',
  googleAppSecret: process.env.GOOGLE_APP_SECRET || '',
  twitterClientID: process.env.TWITTER_CLIENT_ID || '',
  twitterClientSecret: process.env.TWITTER_CLIENT_SECRET || '',
  token: {
    secret: process.env.AUTH_TOKEN_SECRET || '',
    // @ts-ignore
    algorithm: process.env.AUTH_TOKEN_ALGORITHM || 'HS512',
    issuer: process.env.AUTH_TOKEN_ISSUER || '',
    // @ts-ignore
    expiresIn: +process.env.AUTH_TOKEN_EXPIRATION_TIME || 3600,
  },
  swaggerUi: {
    options: {
      swaggerOptions: {
        url: `http://${process.env.HOST}:${process.env.PORT}/openapi.yml`,
      },
    },
  },
};

