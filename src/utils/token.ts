import { promisify } from 'util';
import { sign, verify, Algorithm } from 'jsonwebtoken';
import { Token as TokenConfig } from '../config';

const signAsync: Function = promisify(sign);
const verifyAsync: Function = promisify(verify);

// TODO: use RSA sign
export async function generateToken<T extends object> (data: T, cfg: TokenConfig): Promise<string | undefined> {
  const token: string | undefined = await signAsync(data, cfg.secret, {
    algorithm: cfg.algorithm,
    expiresIn: cfg.expiresIn,
    issuer: cfg.issuer,
  });
  return token;
}

export async function verifyToken<T extends object> (token: string, cfg: TokenConfig): Promise<T> {
  const algorithm: Algorithm = cfg.algorithm;
  const result: T = await verifyAsync(token, cfg.secret, {
    algorithms: [algorithm],
    issuer: cfg.issuer,
  });
  return result;
}
