// src/routes/__tests__/userRoutes.test.ts
import * as chai from 'chai';
import * as sinon from 'sinon';
import {IUser} from '../../types';
import {app, server} from '../../src/app';
import * as middlewares from '../../src/middlewares/middlewares';
import {Request, Response, NextFunction} from 'express';
import {ParamsDictionary} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import * as userService from "../../src/services/userService";
import mongoose from "mongoose";
import {IUserController} from "../../src/controllers/IUserController";
import ClassicUserController from "../../src/controllers/userController";

const chaiHttp = require('chai-http');


const {expect} = chai;
chai.use(chaiHttp);

describe('User Routes', () => {
    const userUuid = 'some-uuid';
    const userData: IUser = {
        uuid: userUuid,
        email: 'test@test.com',
        name: 'Test User',
        password: 'password',
    };
    const userController: IUserController = new ClassicUserController();

    afterEach(() => {
        sinon.restore();
    });

    after(async() => {
        // The test still running after finishing all tests
        await mongoose.connection.close();
        // end the server
// Close the server
        server.close(() => {
            console.log('Http server closed.');
        });
    });

    describe('POST /users/register', () => {
        it('should register a user', async () => {
            const createUserStub = sinon.stub(userController, 'createUser').callsFake((req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => {
                res.status(200).send();
                return Promise.resolve(); // Removed res from here
            });

            // mock registerUser from user service
            sinon.stub(userService, 'registerUser').resolves();

            const res = await chai.request(app)
                .post('/users/register')
                .send(userData);


            console.log(res.body);

            expect(res.status).to.equal(201);
        });
    });


    describe('POST /users/login', () => {
        it('should log in a user', async () => {
            const loginStub = sinon.stub(userController, 'login').callsFake((req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => {
                res.status(200).send();
                return Promise.resolve(); // Removed res from here
            });

            // mock registerUser from user service
            sinon.stub(userService, 'loginUser').resolves({
                user: userData,
                token: "token"
            });

            const res = await chai.request(app)
                .post('/users/login')
                .send({email: userData.email, password: userData.password});

            expect(res.status).to.equal(201);
        });

    });

    describe('GET /users/:userUuid', () => {
        it('should throw unauthorized when getting a user', async () => {
            const authenticateStub = sinon.stub(middlewares, 'authenticate').callsFake((req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => {
                res.status(200).send();
                return Promise.resolve(res);
            });
            const getUserStub = sinon.stub(userController, 'getUser').callsFake((req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => {
                res.status(200).send();
                return Promise.resolve(); // Removed res from here
            });

            // TODO: 401, unauthorized
            const res = await chai.request(app).get(`/users/${userUuid}`);

            // Mock getUser from user service
            sinon.stub(userService, 'getUser').resolves(userData);

            expect(res.status).to.equal(401);
        });
    });

    describe('PUT /users/:userUuid', () => {
        it('should throw unauthorized when  updating a user', async () => {
            const authenticateStub = sinon.stub(middlewares, 'authenticate').callsFake((req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => {
                res.status(200).send();
                return Promise.resolve(res);
            });
            const updateUserStub = sinon.stub(userController, 'updateUser').callsFake((req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => {
                res.status(200).send();
                return Promise.resolve(); // Removed res from here
            });
            // TODO: 401, unauthorized
            const res = await chai.request(app).put(`/users/${userUuid}`).send(userData);

            expect(res.status).to.equal(401);
        });
    });

    describe('DELETE /users/:userUuid', () => {
        it('should throw unauthorized when deleting a user', async () => {
            const authenticateStub = sinon.stub(middlewares, 'authenticate').callsFake((req: Request, res: Response, next: NextFunction) => {
                next();
                return Promise.resolve(res);
            });
            const deleteUserStub = sinon.stub(userController, 'deleteUser').callsFake((req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => {
                res.status(200).send();
                return Promise.resolve(); // Removed res from here
            });

            // TODO: 401, unauthorized
            const res = await chai.request(app).delete(`/users/${userUuid}`);

            expect(res.status).to.equal(401);
        });
    });
});
