import fs from 'fs';
import dotenv from 'dotenv';
import { configure } from 'log4js';

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
} else {
  console.error('.env file does not exist');
  process.exit(1);
}
import { config } from '../config';

if (process.env.NODE_ENV === 'production') {
  configure({
    appenders: {
      logstash: {
        type: '@log4js-node/logstashudp',
        host: config.logstash.host,
        port: config.logstash.port
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
