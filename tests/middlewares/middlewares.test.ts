// test/middlewares/middlewares.test.ts

import { expect } from 'chai';
import { createSandbox, SinonSandbox } from 'sinon';
import { authenticate } from '../../src/middlewares/middlewares';
import { Express, Request, Response } from 'express';
import supertest from 'supertest';
import 'mocha';
import * as hashingUtil from '../../src/utils/hashingUtil';
import {IUserPayload} from "../../types";

describe('Middlewares', () => {
    let sandbox: SinonSandbox;
    let server: Express;
    let request: supertest.SuperTest<supertest.Test>;

    beforeEach(() => {
        sandbox = createSandbox();

        server = require('express')();
        server.use(require('body-parser').json());
        server.use(authenticate);
        server.get('/', (req: Request, res: Response) => {
            res.status(200).json({ message: "Success" });
        });

        request = supertest(server);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return 401 if no authorization header', async () => {
        const response = await request.get('/');

        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('message', 'Unauthorized');
    });

    it('should return 401 if authorization header is not correctly formatted', async () => {
        const response = await request.get('/').set('authorization', 'Bearer');

        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('message', 'Unauthorized');
    });

    it('should return 401 if scheme is not Bearer', async () => {
        const response = await request.get('/').set('authorization', 'Basic token');

        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('message', 'Unauthorized');
    });

    it('should return 401 if token is not verified', async () => {
        sandbox.stub(hashingUtil, 'verifyToken').throws();
        const response = await request.get('/').set('authorization', 'Bearer token');

        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('message', 'Unauthorized');
    });

    it('should return 401 if there is an error during token verification', async () => {
        sandbox.stub(hashingUtil, 'verifyToken').throws();
        const response = await request.get('/').set('authorization', 'Bearer token');

        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('message', 'Unauthorized');
    });

    it('should continue if everything is valid', async () => {
        const payload: IUserPayload = {
            uuid: 'uuid',
            email: 'email',
            iat: 0,
        }
        sandbox.stub(hashingUtil, 'verifyToken').returns(new Promise((resolve) => resolve(
           payload
        )));
        const response = await request.get('/').set('authorization', 'Bearer validtoken');

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message', 'Success');
    });
});
