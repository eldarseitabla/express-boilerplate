export interface ITypes {
  BooksController: symbol;
  BooksService: symbol;
  UsersController: symbol;
  UsersService: symbol;
}

const TYPES: ITypes = {
  BooksController: Symbol.for('BooksController'),
  BooksService: Symbol.for('BooksService'),
  UsersController: Symbol.for('UsersController'),
  UsersService: Symbol.for('UsersService')
};

export default TYPES;
