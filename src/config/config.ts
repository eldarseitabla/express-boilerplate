import fs from 'fs';
import dotenv from 'dotenv';
import { configure } from 'log4js';

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
} else {
  console.error('.env file does not exist');
  process.exit(1);
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
  };
}

export enum Env {
  production = 'production',
  development = 'development',
  test = 'test',
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
  authSecret: string;
  authTokenExpirationTime: number;
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
  protocol: process.env.PROTOCOL,
  host: process.env.HOST,
  port: +process.env.PORT,
  clusterMode: false,
  startTimeoutMs: 2000,
  mongo: {
    url: process.env.MONGODB_URL,
    options: {
      useNewUrlParser: true,
      poolSize: 10,
    },
  },
  redis: {
    url: process.env.REDIS_URL,
    options: {},
  },
  postgres: {
    url: process.env.POSTGRES_URL,
    options: {
      logging: false,
      dialect: 'postgres',
    },
  },
  logstash: {
    host: process.env.LOGSTASH_HOST,
    port: +process.env.LOGSTASH_PORT,
  },
  sequelizeConnectionOptions: {},
  facebookAppId: process.env.FACEBOOK_APP_ID,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
  googleAppId: process.env.GOOGLE_APP_ID,
  googleAppSecret: process.env.GOOGLE_APP_SECRET,
  twitterClientID: process.env.TWITTER_CLIENT_ID,
  twitterClientSecret: process.env.TWITTER_CLIENT_SECRET,
  authSecret: process.env.AUTH_SECRET,
  authTokenExpirationTime: +process.env.AUTH_TOKEN_EXPIRATION_TIME,
  swaggerUi: {
    options: {
      swaggerOptions: {
        url: `http://${process.env.HOST}:${process.env.PORT}/openapi.yml`,
      },
    },
  },
};

switch (process.env.NODE_ENV) {
  case 'production':
    configure({
      appenders: {
        logstash: {
          type: '@log4js-node/logstashudp',
          host: config.logstash.host,
          port: config.logstash.port,
        },
      },
      categories: {
        default: { appenders: ['logstash'], level: 'info' },
      },
    });
    break;
  case 'development':
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
  case 'test':
    configure({
      appenders: {
        console: { type: 'console' },
      },
      categories: {
        fatalError: { appenders: ['fatalError'], level: 'fatal' },
        consoleError: { appenders: ['consoleError'], level: 'error' },
        console: { appenders: ['console'], level: 'trace' },
        default: { appenders: ['console', 'consoleError', 'fatalError'], level: 'trace' },
      },
    });
    break;
  default:
    console.error('process.env.NODE_ENV does not exist');
    process.exit(1);
}
