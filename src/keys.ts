
export namespace DITypes {
  export interface Types {
    BookController: symbol;
    BookService: symbol;
    UserController: symbol;
    AuthController: symbol;
    UserService: symbol;
    RefreshTokenService: symbol;
    TokenService: symbol;
  }

  export const TYPES: Types = {
    BookController: Symbol.for('BookController'),
    BookService: Symbol.for('BookService'),
    UserController: Symbol.for('UserController'),
    AuthController: Symbol.for('AuthController'),
    UserService: Symbol.for('UserService'),
    RefreshTokenService: Symbol.for('RefreshTokenService'),
    TokenService: Symbol.for('TokenService'),
  };
}
