import { injectable } from 'inversify';

export interface IUsersService {
    signUp(): Promise<string[]>;
    signIn(): Promise<object>;
    signOut(): Promise<void>;
}

@injectable()
export class UsersService implements IUsersService {
  async signUp(): Promise<string[]> {
    return [];
  }

  async signIn(): Promise<object> {
    return {};
  }

  async signOut(): Promise<void> {
    return;
  }
}
