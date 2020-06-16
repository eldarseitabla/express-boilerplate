import { injectable } from 'inversify';
import { config, TokenType } from '../config';
import { RefreshTokenDocument, RefreshTokenMongo as RefreshToken } from '../models';
import { GeneratedTokenResult, generateToken, verifyToken } from '../utils/token';
import { VerifyTokenResult, Errors } from '../declarations';
import { TokenExpiredError } from 'jsonwebtoken';
import httpErrors from 'http-errors';

export type PayloadToken = {
  userId: string;
}

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPairWithId extends TokenPair {
  refreshTokenId: string;
}

@injectable()
export class TokenService {
  async getTokenPairWithId (userId: string, payload: PayloadToken): Promise<TokenPairWithId> {
    const accessTokenResult: GeneratedTokenResult = await generateToken(payload, config.accessToken);
    if (!accessTokenResult.token) {
      throw new Error('Unpossible generate access token');
    }

    const refreshTokenResult: GeneratedTokenResult = await generateToken<PayloadToken>(payload, config.refreshToken);
    if (!refreshTokenResult.token || !refreshTokenResult.refreshTokenId) {
      throw new Error('Unpossible generate refresh token');
    }

    return {
      accessToken: accessTokenResult.token,
      refreshToken: refreshTokenResult.token,
      refreshTokenId: refreshTokenResult.refreshTokenId,
    };
  }

  async refreshToken (token: string, payload: PayloadToken): Promise<TokenPair> {
    try {
      const verifyTokenResult: VerifyTokenResult = await verifyToken<VerifyTokenResult>(token, config.refreshToken);

      if (verifyTokenResult.type !== TokenType.refresh || !verifyTokenResult.refreshTokenId) {
        throw new httpErrors.Unauthorized(Errors.Auth.invalidToken);
      }

      const refreshToken: RefreshTokenDocument | null = await RefreshToken.findOne({ tokenId: verifyTokenResult.refreshTokenId });

      if (!refreshToken) {
        throw new httpErrors.NotFound();
      }

      await RefreshToken.deleteMany({ tokenId: refreshToken.tokenId });

      const tokenPairWithId: TokenPairWithId = await this.getTokenPairWithId(refreshToken.userId, payload);

      await RefreshToken.create({ tokenId: tokenPairWithId.refreshTokenId, userId: refreshToken.userId });

      return { refreshToken: tokenPairWithId.refreshToken, accessToken: tokenPairWithId.accessToken };
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new httpErrors.Forbidden(Errors.Auth.tokenExpired);
      }
      if (err.message && err.message === 'jwt malformed') {
        throw new httpErrors.NotFound();
      }
      throw err;
    }
  }

  async removeRefreshToken (userId: string): Promise<void> {
    await RefreshToken.deleteMany({ userId });
  }

  async addRefreshToken (tokenId: string, userId: string): Promise<void> {
    await RefreshToken.create({ tokenId, userId });
  }
}
