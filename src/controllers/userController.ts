// src/controllers/userController.ts
import {Request, Response} from 'express';
import {
    getUser as getUserService,
    deleteUser as deleteUserService,
    updateUser as updateUserService,
    loginUser as loginUserService,
    registerUser
} from "../services/userService";
import {IUserController} from "./IUserController";

export default class ClassicUserController implements IUserController {
    async createUser(req: Request, res: Response): Promise<void> {
        const {email, name, password} = req.body;
        try {
            await registerUser(email, name, password);
            res.status(201).send({
                message: 'User created successfully',
                code: 201
            });
        } catch (e: any) {
            console.error(e.message);
            res.status(500).send({
                message: 'Failed to create user',
                code: 500
            });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        const {userUuid} = req.params;
        try {
            await deleteUserService(userUuid);
            res.status(200).send({
                message: 'User deleted',
                code: 200
            });
        } catch (e: any) {
            console.error(e.message);
            res.status(500).send({
                message: 'Failed to delete user',
                code: 500
            });
        }
    }

    async getUser(req: Request, res: Response): Promise<void> {
        const {userUuid} = req.params;
        try {
            const user = await getUserService(userUuid);
            res.status(200)
                .send({
                    message: 'User details',
                    code: 200,
                    data: user
                });
        } catch (e: any) {
            console.error(e.message);
            res.status(500).send({
                message: 'Failed to get user details',
                code: 500
            });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        const {email, password} = req.body;
        try {
            const response = await loginUserService(email, password);
            response.user.password = '';
            res.status(201).send({
                message: 'User login successfully',
                data: {
                    user: response.user,
                    token: response.token
                }
            });
        } catch (e: any) {
            console.error(e.message);
            res.status(500).send({
                message: 'Failed to login',
                code: 500
            });
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        const {userUuid} = req.params;
        const {oldPassword, newPassword} = req.body;
        try {
            await updateUserService(userUuid, oldPassword, newPassword);
            res.status(200).send({
                message: 'Successfully updated user',
                code: 200
            });
        } catch (e: any) {
            console.error(e.message);
            res.status(500).send({
                message: 'Failed to update user',
                code: 500
            });
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        console.log("[NOT IMPLEMENTED] refreshToken");
    }

        async logout(req: Request, res: Response): Promise<void> {
        console.log("[NOT IMPLEMENTED] logout");
        return Promise.resolve(undefined);
    }

}