/// <reference types="playfab-sdk/Scripts/typings/PlayFab/PlayFab" />
/// <reference types="playfab-sdk/Scripts/typings/PlayFab/PlayFabClient" />
/// <reference types="playfab-sdk/Scripts/typings/PlayFab/PlayFabServer" />
/// <reference types="playfab-sdk/Scripts/typings/PlayFab/PlayFabAdmin" />

import express from 'express';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';

import {
  errorMiddleware,
  notFoundMiddleware,
  performTimingMiddleware,
} from './middleware';

import playFabRouter from './modules/playfab/play-fab.router';

const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.set('HOST', process.env.HOST || 'localhost');
app.use(performTimingMiddleware());
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/** Prepare for swagger */
app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);

/** API routes ... */
app.use('/playfab', playFabRouter);

/** Error Handler. Provides full stack - remove for production */
app.use('*', notFoundMiddleware);
app.use(errorMiddleware);

export default app;
