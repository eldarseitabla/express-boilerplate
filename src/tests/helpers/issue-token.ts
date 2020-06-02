import { sign } from 'jsonwebtoken';

export const issueToken: Function = (data: object, options: object = {}): string => sign(data, 'TEST', options);
