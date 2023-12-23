// src/middlewares/middlewares.ts
import { Response, NextFunction, Request as ExpressRequest } from 'express';
import { verifyToken } from "../utils/hashingUtil";
import APIUserController from "../controllers/userController.api";

export const authenticate = async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            message: "Unauthorized",
            code: 401
        });
    }

    const parts = authorization.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({
            message: "Unauthorized",
            code: 401
        });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({
            message: "Unauthorized",
            code: 401
        });
    }

    try {
        //await verifyToken(token); WITHOUT KEYCLOAK
        const userController: APIUserController = new APIUserController();
        await userController.verifyToken(token);
    } catch (e) {
        console.log('[ERROR] Invalid token received')
        return res.status(401).json({
            message: "Unauthorized",
            code: 401
        });
    }

    next();
};
