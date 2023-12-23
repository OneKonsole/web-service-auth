// src/routes/userRoutes.ts
import express from 'express';
import ClassicUserController from "../controllers/userController";
import {IUserController} from "../controllers/IUserController";
import {authenticate} from '../middlewares/middlewares';
import APIUserController from "../controllers/userController.api"; // Classic
// API token verification

const router = express.Router();

const userController: IUserController = new APIUserController();

router.post('/users/register', (req, res) => userController.createUser(req, res));
router.post('/users/logout', authenticate, (req, res) => userController.logout(req, res));
router.post('/users/login', (req, res) => userController.login(req, res));
router.post('/users/refresh', (req, res) => userController.refreshToken(req, res));
router.get('/users/:userUuid', authenticate, (req, res) => userController.getUser(req, res));
router.put('/users/:userUuid', authenticate, (req, res) => userController.updateUser(req, res));
router.delete('/users/:userUuid', authenticate, (req, res) => userController.deleteUser(req, res));
export default router;
