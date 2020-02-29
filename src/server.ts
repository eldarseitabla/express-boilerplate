import { getLogger } from 'log4js';
import './utils/env';
import app from './app';

const logger = getLogger('[server]');

const server = app.listen(app.get('port'), app.get('host'), (error) => {
  if (!error) {
    logger.info(
      'App is running at http://localhost:%d in %s mode',
      app.get('port'),
      app.get('env')
    );
  } else {
    logger.error({ message: 'Error start server', error });
  }
});

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
