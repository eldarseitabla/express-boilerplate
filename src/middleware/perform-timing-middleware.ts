import { Response, Request, NextFunction } from 'express';
import responseTime from 'response-time';
import { getLogger } from 'log4js';

const logger = getLogger('[middleware.performTimingMiddleware]');

const performTimingMiddleware = () => {
  return responseTime( (req, res, time) => {
    // const stat = (req.method + req.url)
    //   .replace(/[:.]/g, '')
    //   .replace(/\//g, '_');
    logger.info(`${req.method + req.url} - ${time}ms`);
  });
};

export { performTimingMiddleware };
