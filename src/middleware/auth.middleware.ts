import { NextFunction, Request, Response } from 'express';
import { config, TokenType } from '../config';
import httpErrors from 'http-errors';
import { verifyToken } from '../utils/token';
import { Errors, VerifyTokenResult } from '../declarations';
import { TokenExpiredError } from 'jsonwebtoken';


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization: string = req.headers.authorization || '';

    if (!authorization) {
      return next(new httpErrors.Forbidden(`${req.method} ${req.originalUrl}`));
    }

    const token = authorization.split(' ')[1];
    const verifyTokenResult: VerifyTokenResult = await verifyToken<VerifyTokenResult>(token, config.accessToken);

    if (verifyTokenResult.type !== TokenType.access) {
      return next(new httpErrors.Forbidden(`${req.method} ${req.originalUrl}`));
    }

    res.locals.tokenPayload = { userId: verifyTokenResult.userId };
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return next(new httpErrors.Unauthorized(Errors.Auth.tokenExpired));
    }
    next(err);
  }
};
