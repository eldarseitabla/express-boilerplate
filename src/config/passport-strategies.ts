import passport from 'passport';
import passportLocal from 'passport-local';
import passportFacebook, { Profile } from 'passport-facebook';
import { promisify } from 'util';
import { UserMongo as User, UserDocument } from '../models';
import { config } from './config';

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

export const local = new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  const user: UserDocument | null = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return done(undefined, false, { message: `Email ${email} not found.` });
  }
  const comparePasswordAsync: Function = promisify(user.comparePassword);
  const isMatch: boolean = await comparePasswordAsync.bind(user)(password);
  if (isMatch) {
    return done(undefined, user);
  }
  return done(undefined, false, { message: 'Invalid email or password.' });
});

export const facebook = new FacebookStrategy({
  clientID: config.facebookAppId,
  clientSecret: config.facebookAppSecret,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
  passReqToCallback: true,
}, async (req: any, accessToken: string, refreshToken: string, profile: Profile, done) => {
  if (req.user) {
    try {
      const existingUser = await User.findOne({ facebook: profile.id });
      if (existingUser) {
        return done(new Error('There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.'), false);
      } else {
        const user: UserDocument | null = await User.findById(req.user.id);
        if (!user) {
          return done(undefined, false, { message: 'User not found.' });
        }
        user.facebook = profile.id;
        // user.tokens.push({ kind: 'facebook', accessToken });
        user.profile.name = user.profile.name || `${profile.displayName}`;
        user.profile.gender = user.profile.gender || profile._json.gender; // eslint-disable-line
        user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
        await user.save();
        return done(undefined, user);
      }
    } catch (err) {
      return done(err, false);
    }
  } else {
    try {
      const existingUser = await User.findOne({ facebook: profile.id });
      if (existingUser) {
        return done(undefined, existingUser);
      }
      const existingEmailUser = await User.findOne({ email: profile._json.email }); // eslint-disable-line
      if (existingEmailUser) {
        done(new Error('There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.'), false);
      } else {
        const user: any = new User();
        user.email = profile._json.email; // eslint-disable-line
        user.facebook = profile.id;
        user.tokens.push({ kind: 'facebook', accessToken });
        user.profile.name = `${profile.displayName}`;
        user.profile.gender = profile._json.gender; // eslint-disable-line
        user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
        user.profile.location = (profile._json.location) ? profile._json.location.name : ''; // eslint-disable-line
        await user.save();
        done(undefined, user);
      }
    } catch (err) {
      return done(err, false);
    }
  }
});
