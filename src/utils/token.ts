import { promisify } from 'util';
import { Algorithm, sign, verify } from 'jsonwebtoken';
import { Token, TokenType } from '../config';
import { v4 as uuid } from 'uuid';

const signAsync: Function = promisify(sign);
const verifyAsync: Function = promisify(verify);

export type GeneratedTokenResult = {
  token: string | undefined;
  refreshTokenId: string | null;
}

// TODO: use RSA sign
export async function generateToken<T> (data: T, cfg: Token): Promise<GeneratedTokenResult> {
  const payload: { refreshTokenId: string | null; type: TokenType } = {
    refreshTokenId: (cfg.type === TokenType.refresh) ? uuid() : null,
    type: cfg.type,
    ...data,
  };

  const token: string | undefined = await signAsync(payload, cfg.secret, {
    algorithm: cfg.algorithm,
    expiresIn: cfg.expiresIn,
    issuer: cfg.issuer,
  });
  return { token, refreshTokenId: payload.refreshTokenId };
}

export async function verifyToken<T> (token: string, cfg: Token): Promise<T> {
  const algorithm: Algorithm = cfg.algorithm;
  const result: T = await verifyAsync(token, cfg.secret, {
    algorithms: [algorithm],
    issuer: cfg.issuer,
  });
  return result;
}
