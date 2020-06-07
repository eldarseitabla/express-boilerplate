import { PayloadToken } from './services';
import { TokenType } from './config';

export interface VerifyTokenResult extends PayloadToken {
  refreshTokenId: string | null;
  userId: string;
  type: TokenType;
  iat: number;
  exp: number;
  iss: string;
}

export namespace Errors {
  export enum Auth {
    tokenExpired = 'Token expired',
    invalidToken = 'Invalid token',
  }
}
