import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response, Router } from 'express';
import { check, body, validationResult } from 'express-validator';
import httpErrors from 'http-errors';
import passport from 'passport';
import { IVerifyOptions } from 'passport-local';
import { UserDocument } from '../models';
import { container } from '../app';
import { DITypes } from '../keys';
import { userRouter } from './user.controller';
import { local as localStrategy, facebook as facebookStrategy } from '../config';
import { AuthService, UserService, TokenPair } from '../services';
import { authenticate } from '../middleware';

passport.use('local', localStrategy);
passport.use('facebook', facebookStrategy);
// passport.use('google', strategies.google);

interface AuthenticateResponse {
  user: UserDocument;
  info: IVerifyOptions;
}

@injectable()
export class AuthController {
  constructor (@inject(DITypes.TYPES.UserService) private userService: UserService,
               @inject(DITypes.TYPES.AuthService) private authService: AuthService) {}

  async signUp (req: Request, res: Response, next: NextFunction): Promise<void> {
    await check('email', 'Email is not valid').isEmail().run(req);
    await check('password', 'Password must be at least 4 characters long').isLength({ min: 4 }).run(req);
    await check('confirmPassword', 'Passwords do not match').equals(req.body.password).run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new httpErrors.UnprocessableEntity(JSON.stringify(errors.array())));
    }

    try {
      await this.userService.signUp(req.body.email, req.body.password);
      res.send({ message: 'Success' });
    } catch (err) {
      return next(err);
    }
  }

  async signIn (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await check('email', 'Email is not valid').isEmail().run(req);
      await check('password', 'Password cannot be blank').isLength({ min: 1 }).run(req);
      // eslint-disable-next-line @typescript-eslint/camelcase
      await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        console.log('ERRORS:', errors);
        return next(new httpErrors.UnprocessableEntity(JSON.stringify(errors.array())));
      }

      passport.authenticate('local', async (err: Error, user: UserDocument, info: IVerifyOptions) => {
        if (err) { return next(err); }
        if (!user) {
          return next(new httpErrors.Forbidden(info.message));
        }
        const { token, refreshToken }: TokenPair = await this.authService.getTokenPair(user.id,
          { userId: user.id });
        res.send({ token: token, refreshToken });
      })(req, res, next);
    } catch (err) {
      next(err);
    }
  }

  async refreshToken (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const tokenPair: TokenPair = await this.authService.refreshToken(refreshToken, res.locals.tokenPayload);
      res.send({ token: tokenPair.token, refreshToken: tokenPair.refreshToken });
    } catch (err) {
      next(err);
    }
  }

  async signOut (req: Request): Promise<void> {
    req.logout();
  }
}

export const authRouter: Router = Router();

// [x]
authRouter.post('/sign-up', async (req: Request, res: Response, next: NextFunction) => {
  container.get<AuthController>(DITypes.TYPES.AuthController).signUp(req, res, next);
});

// [x]
authRouter.post('/sign-in', async (req: Request, res: Response, next: NextFunction) => {
  container.get<AuthController>(DITypes.TYPES.AuthController).signIn(req, res, next);
});

// [ ]
authRouter.post('/refresh-token', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  container.get<AuthController>(DITypes.TYPES.AuthController).refreshToken(req, res, next);
});

// [ ]
authRouter.get('/sign-out', async (req: Request) => {
  container.get<AuthController>(DITypes.TYPES.AuthController).signOut(req);
});

// [ ]
userRouter.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile'],
} ));

// []
userRouter.get('/facebook-callback', passport.authenticate('facebook', {
  failureRedirect: '/auth/sign-in',
}),
(req: Request, res: Response) => {
  // res.redirect(req.session.returnTo || '/');
});
