
export namespace DITypes {
  export interface Types {
    BookController: symbol;
    BookService: symbol;
    UserController: symbol;
    UserService: symbol;
  }

  export const TYPES: Types = {
    BookController: Symbol.for('BookController'),
    BookService: Symbol.for('BookService'),
    UserController: Symbol.for('UserController'),
    UserService: Symbol.for('UserService'),
  };
}
