import 'reflect-metadata'; // Important to inversify
import { Container } from 'inversify';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
// import expressSession from 'express-session';
import path from 'path';
import mongoose from 'mongoose';
import { DITypes } from './keys';
import { config } from './config';
import {
  errorMiddleware,
  notFoundMiddleware,
  performTimingMiddleware,
  headerCacheControl,
} from './middleware';
import { userRouter, UserController, bookRouter, BookController, authRouter, AuthController } from './controllers';
import { UserService, BookService, AuthService, RefreshTokenService } from './services';

const container: Container = new Container();

container.bind<AuthController>(DITypes.TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind<UserController>(DITypes.TYPES.UserController).to(UserController).inSingletonScope();
container.bind<BookController>(DITypes.TYPES.BookController).to(BookController).inSingletonScope();

container.bind<UserService>(DITypes.TYPES.UserService).to(UserService).inSingletonScope();
container.bind<BookService>(DITypes.TYPES.BookService).to(BookService).inSingletonScope();
container.bind<RefreshTokenService>(DITypes.TYPES.RefreshTokenService).to(RefreshTokenService).inSingletonScope();
container.bind<AuthService>(DITypes.TYPES.AuthService).to(AuthService).inSingletonScope();

async function init (): Promise<void> {
  console.log('config.mongo.url', config.mongo.url);
  await mongoose.connect(config.mongo.url, config.mongo.options);
}

const app: express.Application = express();
app.set('port', config.port || 3000);
app.set('init', init);
app.use(cors());
app.use(performTimingMiddleware());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(expressSession({ secret: process.env.AUTH_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use('/*', headerCacheControl);
app.get('/', (req, res) => { res.sendFile('./public/index.html'); });
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, config.swaggerUi.options));
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('*', notFoundMiddleware);
app.use(errorMiddleware);

export { app, container };
