import { injectable } from 'inversify';
import { config } from '../config';
import { v4 as uuid } from 'uuid';
import { RefreshTokenDocument, RefreshTokenMongo as RefreshToken } from '../models';
import { generateToken } from '../utils/token';

export interface PayloadToken {
  userId: string;
}

export interface TokenPair {
  token: string;
  refreshToken: string;
}

@injectable()
export class AuthService {
  async getTokenPair (userId: string, payload: PayloadToken): Promise<TokenPair> {
    const newRefreshToken = uuid();
    const refreshToken: RefreshTokenDocument = new RefreshToken({
      token: newRefreshToken,
      userId: userId,
    });
    await refreshToken.save();
    const token: string | undefined = await generateToken(payload, config.token);
    if (!token) {
      throw new Error('Unpossible generate token');
    }
    return {
      token,
      refreshToken: newRefreshToken,
    };
  }

  async refreshToken (token: string, payload: PayloadToken): Promise<TokenPair> {
    const refreshToken: RefreshTokenDocument | null = await RefreshToken.findOne({ token: token });
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }
    await RefreshToken.remove({
      token: refreshToken.token,
    });

    const tokenPair: TokenPair = await this.getTokenPair(refreshToken.userId, payload);
    return tokenPair;
  }
}
