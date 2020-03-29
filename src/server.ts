import { getLogger } from 'log4js';
import './utils/env';
import { Server } from 'http';
import { app } from './app';
import { config } from './config';

const logger = getLogger('[server]');

let server: Server;
(async() => {
  try {
    server = await app.listen(config.port, config.host);
    logger.info('App is running at http://%s:%d in %s mode', config.host, config.port, process.env.NODE_ENV);
  } catch (err) {
    console.error(err);
    logger.error({ message: 'Error start server', err });
    process.exit(1);
  }
})();

process.on('SIGINT', () => {
  logger.debug('Start Signal is SIGINT ...');
  server.close((error) => {
    if (error) {
      logger.error(`Signal is SIGINT ${error.message}`);
      process.exit(1);
    }
    logger.debug('Done Signal is SIGINT');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  logger.debug('Signal is SIGTERM');
  server.close((error) => {
    if (error) {
      logger.error(`Signal is SIGTERM ${error.message}`);
      process.exit(1);
    }
    logger.debug('Done Signal is SIGTERM');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, p) => {
  logger.fatal('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

process.on('uncaughtException', err => {
  logger.fatal('Unhandled Exception at: ', err);
});

export { server };
