import { Router } from 'express';
import adminRouter from './admin/admin.router';
import clientRouter from './client/client.router';

const playFabRouter: Router = Router();

playFabRouter.use('/admin', adminRouter);
playFabRouter.use('/client', clientRouter);

export default playFabRouter;
