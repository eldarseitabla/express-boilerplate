import { Response, Request, NextFunction } from 'express';
import { config } from '../config';
import httpErrors from 'http-errors';
import { verifyToken } from '../utils/token';
import { PayloadToken } from '../services';

export interface VerifyTokenResult extends PayloadToken {
  userId: string;
  iat: number;
  exp: number;
  iss: string;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization: string = req.headers.authorization || '';
    if (!authorization) {
      return next(new httpErrors.Forbidden(`${req.method} ${req.originalUrl}`));
    }
    const token = authorization.split(' ')[1];
    const tokenPayload: VerifyTokenResult = await verifyToken<VerifyTokenResult>(token, config.token);
    res.locals.tokenPayload = { userId: tokenPayload.userId };
    next();
  } catch {
    next(new httpErrors.Forbidden(`${req.method} ${req.originalUrl}`));
  }
};
