import fs from 'fs';
import dotenv from 'dotenv';
import { configure, getLogger } from 'log4js';

if (process.env.NODE_ENV === 'production') {
  configure({
    appenders: {
      logstash: {
        type: '@log4js-node/logstashudp',
        host: 'localhost',
        port: 3001
      }
    },
    categories: {
      default: { appenders: ['logstash'], level: 'info' }
    }
  });
} else {
  configure({
    appenders: {
      fatalError: { type: 'file', filename: '../../logs/fatal.log' },
      fileError: { type: 'file', filename: '../../logs/error.log' },
      console: { type: 'console' }
    },
    categories: {
      fatalError: { appenders: ['fatalError'], level: 'fatal' },
      fileError: { appenders: ['fileError'], level: 'error' },
      console: { appenders: ['console'], level: 'trace' },
      default: { appenders: ['console', 'fileError', 'fatalError'], level: 'trace' }
    }
  });
}

const logger = getLogger('[util.env]');

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
} else {
  logger.error('.env file does not exist');
  process.exit(1);
}

