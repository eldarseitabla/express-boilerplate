import { Router } from 'express';
import ClientController from './client.controller';

const clientRouter: Router = Router();
const clientController = new ClientController();

clientRouter.post('/login-with-custom-id', clientController.loginWithCustomId);
clientRouter.post('/get-photon-authentication-token', clientController.getPhotonAuthenticationToken);
clientRouter.post('/get-content-download-url', clientController.getContentDownloadUrl);

export default clientRouter;
