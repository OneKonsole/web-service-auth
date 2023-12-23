import {expect} from 'chai';
import * as sinon from 'sinon';
import * as userService from "../../src/services/userService";
import {Response, Request} from 'express';
import {createResponse, createRequest} from 'node-mocks-http';
import {IUser} from "../../types";
import ClassicUserController from "../../src/controllers/userController";
import {IUserController} from "../../src/controllers/IUserController";

describe('User Controller', function () {
    let userController: IUserController;
    afterEach(function () {
        sinon.restore();
    });

    beforeEach(function () {
        sinon.stub(console, 'error');
        userController = new ClassicUserController();
    });

    it('should create a new user', async function () {
        const req: Request = {
            method: 'POST',
            url: '/users',
            body: {email: 'test@gmail.com', name: 'Test User', password: 'password'},
            headers: {},
        } as any;

        const send = sinon.spy();
        const status = sinon.stub().returnsThis();

        const res: Response = {
            status,
            send,
        } as any;

        sinon.stub(userService, 'registerUser').resolves();

        await userController.createUser(req, res);

        expect(status.calledOnceWith(201)).to.be.true;
        expect(send.calledOnceWith({message: 'User created successfully'})).to.be.true;
    });

    it('should get user details', async function () {
        const req: Request = createRequest({
            method: 'GET',
            url: '/users/uuid',
            params: {userUuid: 'uuid'}
        });

        const send = sinon.spy();
        const status = sinon.stub().returnsThis();

        const res: Response = {
            status,
            send,
        } as any;

        const user: IUser = {uuid: "uuid", email: 'test@gmail.com', name: 'Test User', password: 'password'};

        sinon.stub(userService, 'getUser').resolves(user);

        await userController.getUser(req, res);

        expect(status.calledOnceWith(200)).to.be.true;
        expect(send.calledOnceWith(user)).to.be.true;
    });

    it('should update a user', async function () {
        const req: Request = createRequest({
            method: 'PUT',
            url: '/users/uuid',
            params: {userUuid: 'uuid'},
            body: {oldPassword: 'oldPassword', newPassword: 'newPassword'}
        });

        const send = sinon.spy();
        const status = sinon.stub().returnsThis();

        const res: Response = {
            status,
            send,
        } as any;

        sinon.stub(userService, 'updateUser').resolves();

        await userController.updateUser(req, res);

        expect(status.calledOnceWith(200)).to.be.true;
        expect(send.calledOnceWith({message: 'Successfully updated user'})).to.be.true;
    });

    it('should delete a user', async function () {
        const req: Request = createRequest({
            method: 'DELETE',
            url: '/users/uuid',
            params: {userUuid: 'uuid'}
        });

        const send = sinon.spy();
        const status = sinon.stub().returnsThis();

        const res: Response = {
            status,
            send,
        } as any;

        sinon.stub(userService, 'deleteUser').resolves();

        await userController.deleteUser(req, res);

        expect(status.calledOnceWith(200)).to.be.true;
        expect(send.calledOnceWith({message: 'User deleted'})).to.be.true;
    });

    it('should login a user', async function () {
        const req: Request = createRequest({
            method: 'POST',
            url: '/users/login',
            body: {email: 'test@gmail.com', password: 'password'}
        });

        const send = sinon.spy();
        const status = sinon.stub().returnsThis();

        const res: Response = {
            status,
            send,
        } as any;

        const user: IUser = {uuid: "uuid", email: 'test@gmail.com', name: 'Test User', password: ''};
        const token = 'token';

        sinon.stub(userService, 'loginUser').resolves({user, token});

        await userController.login(req, res);

        expect(status.calledOnceWith(201)).to.be.true;
        expect(send.calledOnceWith({
            message: 'User login successfully',
            user: user,
            token: token
        })).to.be.true;
    });

    // add these tests after each successful test
    it('should handle errors in user creation', async function () {
        const req: Request = {
            method: 'POST',
            url: '/users',
            body: {email: 'test@gmail.com', name: 'Test User', password: 'password'},
            headers: {},
        } as any;

        const send = sinon.spy();
        const status = sinon.stub().returnsThis();

        const res: Response = {
            status,
            send,
        } as any;

        sinon.stub(userService, 'registerUser').rejects(new Error('Fake error'));

        await userController.createUser(req, res);

        expect(status.calledOnceWith(500)).to.be.true;
        expect(send.calledOnceWith({message: 'Failed to create user'})).to.be.true;
    });

    it('should handle errors in getting user details', async function () {
        const req: Request = createRequest({
            method: 'GET',
            url: '/users/uuid',
            params: {userUuid: 'uuid'}
        });

        const send = sinon.spy();
        const status = sinon.stub().returnsThis();

        const res: Response = {
            status,
            send,
        } as any;

        sinon.stub(userService, 'getUser').rejects(new Error('Fake error'));

        await userController.getUser(req, res);

        expect(status.calledOnceWith(500)).to.be.true;
        expect(send.calledOnceWith({message: 'Failed to get user details'})).to.be.true;
    });

    it('should handle errors in updating a user', async function () {
        const req: Request = createRequest({
            method: 'PUT',
            url: '/users/uuid',
            params: {userUuid: 'uuid'},
            body: {oldPassword: 'oldPassword', newPassword: 'newPassword'}
        });

        const send = sinon.spy();
        const status = sinon.stub().returnsThis();

        const res: Response = {
            status,
            send,
        } as any;

        sinon.stub(userService, 'updateUser').rejects(new Error('Fake error'));

        await userController.updateUser(req, res);

        expect(status.calledOnceWith(500)).to.be.true;
        expect(send.calledOnceWith({message: 'Failed to update user'})).to.be.true;
    });

    it('should handle errors in deleting a user', async function () {
        const req: Request = createRequest({
            method: 'DELETE',
            url: '/users/uuid',
            params: {userUuid: 'uuid'}
        });

        const send = sinon.spy();
        const status = sinon.stub().returnsThis();

        const res: Response = {
            status,
            send,
        } as any;

        sinon.stub(userService, 'deleteUser').rejects(new Error('Fake error'));

        await userController.deleteUser(req, res);

        expect(status.calledOnceWith(500)).to.be.true;
        expect(send.calledOnceWith({message: 'Failed to delete user'})).to.be.true;
    });

    it('should handle errors in login', async function () {
        const req: Request = createRequest({
            method: 'POST',
            url: '/users/login',
            body: {email: 'test@gmail.com', password: 'password'}
        });

        const send = sinon.spy();
        const status = sinon.stub().returnsThis();

        const res: Response = {
            status,
            send,
        } as any;

        sinon.stub(userService, 'loginUser').rejects(new Error('Fake error'));

        await userController.login(req, res);

        expect(status.calledOnceWith(500)).to.be.true;
        expect(send.calledOnceWith({message: 'Failed to login'})).to.be.true;
    });

});
