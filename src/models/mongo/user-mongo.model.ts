import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';
import mongoose from 'mongoose';

export enum Provider {
  facebook = 'facebook',
}

export type Profile = {
  name: string;
  gender: string;
  location: string;
  website: string;
  picture: string;
}

export type UserDocument = mongoose.Document & {
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  facebook: string;
  profile: Profile;
  comparePassword: comparePasswordFunction;
  gravatar: (size: number) => string;
};

type comparePasswordFunction = (candidatePassword: string, cb: (err: Error, isMatch: boolean) => {}) => void;

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  facebook: String,
  twitter: String,
  google: String,
  tokens: Array,

  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String,
  },
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save (next) {
  const user = this as UserDocument;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err: Error, salt: string) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err: mongoose.Error, hash: string) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword: string, cb: Function) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size: number = 200) {
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

export const UserMongo = mongoose.model<UserDocument>('User', userSchema);
