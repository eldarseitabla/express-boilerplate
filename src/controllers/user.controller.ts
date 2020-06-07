import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import httpErrors from 'http-errors';
import { check, sanitize, validationResult } from 'express-validator';
import { DITypes } from '../keys';
import { container } from '../app';
import { UserService } from '../services';
import { UserMongo as User, UserDocument, Provider } from '../models';
import { authenticate } from '../middleware';

@injectable()
export class UserController {
  constructor (@inject(DITypes.TYPES.UserService) private userService: UserService) {}

  async find (req: Request, res: Response): Promise<void> {
    const users: UserDocument[] = await User.find();
    res.send(users);
  }

  async getAccount (req: Request, res: Response): Promise<void> {
    res.send({ title: 'Account Management' });
  }

  async patchById (req: Request, res: Response, next: NextFunction): Promise<void> {
    await check('email', 'Please enter a valid email address.').isEmail().run(req);
    // eslint-disable-next-line @typescript-eslint/camelcase
    await sanitize('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new httpErrors.UnprocessableEntity(JSON.stringify(errors.array())));
    }

    try {
      const { id: userId }: UserDocument = req.user as UserDocument;
      const user: UserDocument | null = await User.findById(userId);
      if (!user) return next(new httpErrors.NotFound('User not found'));
      user.email = req.body.email || '';
      user.profile.name = req.body.name || '';
      user.profile.gender = req.body.gender || '';
      user.profile.location = req.body.location || '';
      user.profile.website = req.body.website || '';
      await user.save();
      res.send({ message: 'Profile information has been updated.' });
    } catch (err) {
      if (err.code === 11000) {
        return next(new httpErrors.Conflict('The email address you have entered is already associated with an account.' ));
      }
      return next(err);
    }
  }

  async updatePassword (req: Request, res: Response, next: NextFunction): Promise<void> {
    await check('password', 'Password must be at least 4 characters long').isLength({ min: 4 }).run(req);
    await check('confirmPassword', 'Passwords do not match').equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new httpErrors.UnprocessableEntity(JSON.stringify(errors.array())));
    }

    try {
      const { id: userId }: UserDocument = req.user as UserDocument;
      const user: UserDocument | null = await User.findById(userId);
      if (!user) return next(new httpErrors.NotFound('User not found'));
      user.password = req.body.password;
      await user.save();
      res.send({ message: 'Password has been changed.' });
    } catch (err) {
      next(err);
    }
  }

  async deleteById (req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id: userId } = req.params;
    try {
      await User.remove({ _id: userId });
      req.logout();
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async deleteAll (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await User.remove({});
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async getOauthUnlink (req: Request, res: Response, next: NextFunction): Promise<void> {
    const provider: Provider = req.params.provider as Provider;
    const { id: userId } = req.user as UserDocument;
    try {
      const user: UserDocument | null = await User.findById(userId);
      if (!user) return next(new httpErrors.NotFound('User not found'));
      user[provider] = '';
      // user.tokens = user.tokens.filter((token: AuthToken) => token.kind !== provider);
      await user.save();
      res.send({ message: `${provider} account has been unlinked.` });
    } catch (err) {
      next(err);
    }
  }

  async reset (req: Request, res: Response, next: NextFunction): Promise<void> {
    await check('password', 'Password must be at least 4 characters long.').isLength({ min: 4 }).run(req);
    await check('confirm', 'Passwords must match.').equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new httpErrors.UnprocessableEntity(JSON.stringify(errors.array())));
    }

    try {
      const user: UserDocument = await this.userService.resetPassword(req.params.token, req.body.password);
      await req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
      });
      await this.userService.sendResetPasswordEmail(user);
      res.send({ message: 'Success! Your password has been changed.' });
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
      return next(new httpErrors.UnprocessableEntity(JSON.stringify(errors.array())));
    }

    const token: string = await this.userService.createRandomToken();
    const user: UserDocument = await this.userService.setRandomToken(token, req.body.email);
    await this.userService.sendForgotPasswordEmail(token, user, req.headers.host || '');
    res.send({ message: 'An e-mail has been sent to {some email} with further instructions.' });
  }
}

export const userRouter: Router = Router();

userRouter.patch('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  container.get<UserController>(DITypes.TYPES.UserController).patchById(req, res, next);
});

userRouter.get('', authenticate, async (req: Request, res: Response) => {
  container.get<UserController>(DITypes.TYPES.UserController).find(req, res);
});

userRouter.get('/:id', authenticate, async (req: Request, res: Response) => {
  container.get<UserController>(DITypes.TYPES.UserController).getAccount(req, res);
});

userRouter.delete('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  container.get<UserController>(DITypes.TYPES.UserController).deleteById(req, res, next);
});

userRouter.delete('', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  container.get<UserController>(DITypes.TYPES.UserController).deleteAll(req, res, next);
});

userRouter.post('/reset', async (req: Request, res: Response, next: NextFunction) => {
  container.get<UserController>(DITypes.TYPES.UserController).reset(req, res, next);
});

userRouter.post('/forgot', async (req: Request, res: Response, next: NextFunction) => {
  container.get<UserController>(DITypes.TYPES.UserController).forgot(req, res, next);
});

userRouter.post('/update-password', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  container.get<UserController>(DITypes.TYPES.UserController).updatePassword(req, res, next);
});

userRouter.get('/account-unlink/:provider', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  container.get<UserController>(DITypes.TYPES.UserController).getOauthUnlink(req, res, next);
});
