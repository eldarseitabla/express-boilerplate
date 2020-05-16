import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import passport from 'passport';
import { IVerifyOptions } from 'passport-local';
import { promisify } from 'util';
import httpErrors from 'http-errors';
import { check, sanitize, validationResult } from 'express-validator';
import { DITypes } from '../keys';
import { container } from '../app';
import { UserService } from '../services';
import { local as localStrategy, facebook as facebookStrategy } from '../config';
import { UserMongo as User, UserDocument, AuthToken, Provider } from '../models';
import { isAuthenticated } from '../middleware';

passport.use('local', localStrategy);
passport.use('facebook', facebookStrategy);
// passport.use('google', strategies.google);

@injectable()
export class UserController {
  constructor (@inject(DITypes.TYPES.UserService) private userService: UserService) {}

  async signUp (req: Request, res: Response, next: NextFunction): Promise<void> {
    await check('email', 'Email is not valid').isEmail().run(req);
    await check('password', 'Password must be at least 4 characters long').isLength({ min: 4 }).run(req);
    await check('confirmPassword', 'Passwords do not match').equals(req.body.password).run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    await sanitize('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new Error(JSON.stringify(errors.array()));
    }

    try {
      const user: UserDocument = new User({
        email: req.body.email,
        password: req.body.password,
      });
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return next(new httpErrors.Conflict('Account with that email address already exists.'));
      }
      await user.save();
      const logInAsync = promisify(req.logIn);
      await logInAsync(user);
      res.send({ message: 'Success' });
    } catch (err) {
      return next(err);
    }
  }

  async find (req: Request, res: Response): Promise<void> {
    const users: UserDocument[] = await User.find();
    res.send(users);
  }

  async signIn (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await check('email', 'Email is not valid').isEmail().run(req);
      await check('password', 'Password cannot be blank').isLength({ min: 1 }).run(req);
      // eslint-disable-next-line @typescript-eslint/camelcase
      await sanitize('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new Error(JSON.stringify(errors.array()));
      }

      passport.authenticate('local', (err: Error, user: UserDocument, info: IVerifyOptions) => {
        if (err) { return next(err); }
        if (!user) {
          return next(new Error(JSON.stringify({ msg: info.message })));
        }
        req.logIn(user, (err) => {
          if (err) { return next(err); }
          res.send({ msg: 'Success! You are logged in.' });
        });
      })(req, res, next);
    } catch (err) {
      next(err);
    }
  }

  async signOut (req: Request): Promise<void> {
    req.logout();
  }

  async getAccount (req: Request, res: Response): Promise<void> {
    res.send({ title: 'Account Management' });
  }

  async updateProfile (req: Request, res: Response, next: NextFunction): Promise<void> {
    await check('email', 'Please enter a valid email address.').isEmail().run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    await sanitize('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new Error(JSON.stringify(errors.array()));
    }

    try {
      const { id: userId }: UserDocument = req.user as UserDocument;
      const user: UserDocument = await User.findById(userId);
      user.email = req.body.email || '';
      user.profile.name = req.body.name || '';
      user.profile.gender = req.body.gender || '';
      user.profile.location = req.body.location || '';
      user.profile.website = req.body.website || '';
      await user.save();
      res.send({ msg: 'Profile information has been updated.' });
    } catch (err) {
      if (err.code === 11000) {
        return next(new Error(JSON.stringify({ msg: 'The email address you have entered is already associated with an account.' })));
      }
      return next(err);
    }
  }

  async updatePassword (req: Request, res: Response, next: NextFunction): Promise<void> {
    await check('password', 'Password must be at least 4 characters long').isLength({ min: 4 }).run(req);
    await check('confirmPassword', 'Passwords do not match').equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new Error(JSON.stringify(errors.array())));
    }

    try {
      const { id: userId }: UserDocument = req.user as UserDocument;
      const user = await User.findById(userId);
      user.password = req.body.password;
      await user.save();
      res.send({ msg: 'Password has been changed.' });
    } catch (err) {
      next(err);
    }
  }

  async deleteAccount (req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id: userId } = req.params;
    try {
      await User.remove({ _id: userId });
      req.logout();
      res.status(204).send({ msg: 'Your account has been deleted.' });
    } catch (err) {
      next(err);
    }
  }

  async getOauthUnlink (req: Request, res: Response, next: NextFunction): Promise<void> {
    const provider: Provider = req.params.provider as Provider;
    const { id: userId } = req.user as UserDocument;
    try {
      const user: UserDocument = await User.findById(userId);
      user[provider] = undefined;
      user.tokens = user.tokens.filter((token: AuthToken) => token.kind !== provider);
      await user.save();
      res.send({ msg: `${provider} account has been unlinked.` });
    } catch (err) {
      next(err);
    }
  }

  async reset (req: Request, res: Response, next: NextFunction): Promise<void> {
    await check('password', 'Password must be at least 4 characters long.').isLength({ min: 4 }).run(req);
    await check('confirm', 'Passwords must match.').equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new Error(JSON.stringify(errors.array()));
    }

    try {
      const user: UserDocument = await this.userService.resetPassword(req.params.token, req.body.password);
      await req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
      });
      await this.userService.sendResetPasswordEmail(user);
      res.send({ msg: 'Success! Your password has been changed.' });
    } catch (err) {
      return next(err);
    }
  }

  async forgot (req: Request, res: Response, next: NextFunction): Promise<void> {
    await check('email', 'Please enter a valid email address.').isEmail().run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    await sanitize('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new Error(JSON.stringify(errors.array())));
    }

    const token: string = await this.userService.createRandomToken();
    const user: UserDocument = await this.userService.setRandomToken(token, req.body.email);
    await this.userService.sendForgotPasswordEmail(token, user, req.headers.host);
    res.send({ msg: 'An e-mail has been sent to {some email} with further instructions.' });
  }
}

export const userRouter: Router = Router();

userRouter.post('', async (req: Request, res: Response, next: NextFunction) => {
  container.get<UserController>(DITypes.TYPES.UserController).signUp(req, res, next);
});

userRouter.post('sign-in', async (req: Request, res: Response, next: NextFunction) => {
  container.get<UserController>(DITypes.TYPES.UserController).signIn(req, res, next);
});
userRouter.get('sign-out', async (req: Request) => {
  container.get<UserController>(DITypes.TYPES.UserController).signOut(req);
});
userRouter.get('', async (req: Request, res: Response) => {
  container.get<UserController>(DITypes.TYPES.UserController).find(req, res);
});
userRouter.get('facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile'],
} ));
userRouter.get('facebook-callback', passport.authenticate('facebook', {
  failureRedirect: '/user/sign-in',
}),
(req: Request, res: Response) => {
  res.redirect(req.session.returnTo || '/');
});
userRouter.post('reset', async (req: Request, res: Response, next: NextFunction) => {
  container.get<UserController>(DITypes.TYPES.UserController).reset(req, res, next);
});
userRouter.post('forgot', async (req: Request, res: Response, next: NextFunction) => {
  container.get<UserController>(DITypes.TYPES.UserController).forgot(req, res, next);
});
userRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  container.get<UserController>(DITypes.TYPES.UserController).deleteAccount(req, res, next);
});
userRouter.post('update-password', async (req: Request, res: Response, next: NextFunction) => {
  container.get<UserController>(DITypes.TYPES.UserController).updatePassword(req, res, next);
});
userRouter.get('account', isAuthenticated, async (req: Request, res: Response) => {
  container.get<UserController>(DITypes.TYPES.UserController).getAccount(req, res);
});
userRouter.post('update-profile', async (req: Request, res: Response, next: NextFunction) => {
  container.get<UserController>(DITypes.TYPES.UserController).updateProfile(req, res, next);
});
userRouter.get('account-unlink/:provider', isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  container.get<UserController>(DITypes.TYPES.UserController).getOauthUnlink(req, res, next);
});
