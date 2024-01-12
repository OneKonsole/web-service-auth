// src/routes/userRoutes.ts
import express from 'express';
import ClassicUserController from "../controllers/userController";
import {IUserController} from "../controllers/IUserController";
import {authenticate} from '../middlewares/middlewares';
import APIUserController from "../controllers/userController.api";
import {LOG_TYPE, logger} from "../utils/logger"; // Classic
// API token verification

const router = express.Router();

const userController: IUserController = new APIUserController();

router.post('/users/register', (req, res) => {
    try {
        return userController.createUser(req, res)
    } catch (e: any) {
        logger(e.message, LOG_TYPE.ERROR);
    }
});
router.post('/users/logout', authenticate, (req, res) => {
    try {
        return userController.logout(req, res)
    } catch (e: any) {
        logger(e.message, LOG_TYPE.ERROR);
    }
});
router.post('/users/login', (req, res) => {
    try {
        return userController.login(req, res)
    } catch (e: any) {
        logger(e.message, LOG_TYPE.ERROR);
    }
});
router.post('/users/refresh', (req, res) => {
    try {
        return userController.refreshToken(req, res)
    } catch (e: any) {
        logger(e.message, LOG_TYPE.ERROR);
    }
});
router.get('/users/:userUuid', authenticate, (req, res) => {
    try {
        return userController.getUser(req, res)
    } catch (e: any) {
        logger(e.message, LOG_TYPE.ERROR);
    }
});
router.put('/users/:userUuid', authenticate, (req, res) => {
    try {
        return userController.updateUser(req, res)
    } catch (e: any) {
        logger(e.message, LOG_TYPE.ERROR);
    }
});
router.delete('/users/:userUuid', authenticate, (req, res) => {
    try {
        return userController.deleteUser(req, res)
    } catch (e: any) {
        logger(e.message, LOG_TYPE.ERROR);
    }
});
export default router;
