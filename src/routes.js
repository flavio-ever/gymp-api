import { Router } from 'express';

import UserController from './app/controllers/UserController';
import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.put('/users', AuthMiddleware, UserController.update);
routes.post('/students', AuthMiddleware, StudentController.store);
routes.put('/students/:id', AuthMiddleware, StudentController.update);
routes.post('/sessions', SessionController.store);

export default routes;
