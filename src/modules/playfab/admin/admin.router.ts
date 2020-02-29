import { Router } from 'express';
import AdminController from './admin.controller';

const adminRouter: Router = Router();
const adminController = new AdminController();

adminRouter.post('/ban-users', adminController.banUsers);

export default adminRouter;
