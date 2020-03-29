import 'reflect-metadata'; // Important to inversify
import { Container } from 'inversify';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import TYPES from './constant/types';
import { config } from './config';

import {
  errorMiddleware,
  notFoundMiddleware,
  performTimingMiddleware,
  headerCacheControl,
} from './middleware';

import books, { IBooksController, BooksController } from './modules/books/books.controller';
import users, { IUsersController, UsersController } from './modules/users/Users.controller';

import { IBooksService, BooksService } from './modules/books/books.service';
import { IUsersService, UsersService } from './modules/users/users.service';
import path from 'path';

const container: Container = new Container();

container.bind<IBooksController>(TYPES.BooksController).to(BooksController).inSingletonScope();
container.bind<IBooksService>(TYPES.BooksService).to(BooksService).inSingletonScope();

container.bind<IUsersController>(TYPES.BooksController).to(UsersController).inSingletonScope();
container.bind<IUsersService>(TYPES.BooksService).to(UsersService).inSingletonScope();

const app: express.Application = express();
app.use(performTimingMiddleware());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);

app.use('/*', headerCacheControl);
app.get('/', (req, res) => { res.sendFile('./public/index.html'); });
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, config.swaggerUi.options));
app.use('/books', books);
app.use('/users', users);
app.use('*', notFoundMiddleware);
app.use(errorMiddleware);

export { app, container };
