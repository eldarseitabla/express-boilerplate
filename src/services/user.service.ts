import { injectable } from 'inversify';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import httpErrors from 'http-errors';
import { UserMongo as User, UserDocument } from '../models';

@injectable()
export class UserService {
  async signUp (email: string, password: string): Promise<void> {
    const user: UserDocument = new User({
      email,
      password,
    });
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new httpErrors.Conflict('Account with that email address already exists.');
    }
    await user.save();
  }

  async resetPassword (token: string, password: string): Promise<UserDocument> {
    const user: UserDocument | null = await User.findOne({ passwordResetToken: token })
      .where('passwordResetExpires').gt(Date.now())
      .exec();
    if (!user) {
      throw new Error('Password reset token is invalid or has expired.');
    }
    user.password = password;
    user.passwordResetToken = '';
    user.passwordResetExpires = new Date();
    await user.save();
    return user;
  }
  async sendResetPasswordEmail (user: UserDocument): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
    const mailOptions = {
      to: user.email,
      from: 'express-ts@starter.com',
      subject: 'Your password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`,
    };
    await transporter.sendMail(mailOptions);
  }

  ///////////////////

  async createRandomToken (): Promise<string> {
    const buf: Buffer = await crypto.randomBytes(16);
    const token = buf.toString('hex');
    return token;
  }

  async setRandomToken (token: string, email: string): Promise<UserDocument> {
    const user: UserDocument | null = await User.findOne({ email });
    if (!user) {
      throw new Error('Account with that email address does not exist.');
    }
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();
    return user;
  }

  async sendForgotPasswordEmail (token: string, user: UserDocument, host: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
    const mailOptions = {
      to: user.email,
      from: 'hackathon@starter.com',
      subject: 'Reset your password on Hackathon Starter',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };
    await transporter.sendMail(mailOptions);
  }
}
