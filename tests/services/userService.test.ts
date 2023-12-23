import { expect } from 'chai';
import * as sinon from 'sinon';
import * as userService from '../../src/services/userService';
import * as userRepository from '../../src/repositories/userRepository';
import * as authService from '../../src/services/authService';
import * as hashingUtil from '../../src/utils/hashingUtil';
import { IUser } from '../../types';
import mongoose from "mongoose";

describe('User Service', () => {
    afterEach(() => {
        sinon.restore();
    });

    after(async() => {
        // The test still running after finishing all tests
        await mongoose.connection.close();
    });

    it('should get user by uuid', async () => {
        const user: IUser = {
            uuid: 'test-uuid',
            email: 'test@example.com',
            password: 'password',
            name: 'Test User',
        };
        sinon.stub(userRepository, 'getUser').resolves(user);

        const result = await userService.getUser('test-uuid');

        expect(result).to.deep.equal({ ...user, password: '' });
    });

    it('should register a user', async () => {
        const user: IUser = {
            uuid: 'test-uuid',
            email: 'test@example.com',
            password: 'password',
            name: 'Test User',
        };
        sinon.stub(authService, 'register').resolves(user);

        const result = await userService.registerUser('test@example.com', 'Test User', 'password');

        expect(result).to.deep.equal(user);
    });

    it('should update a user', async () => {
        sinon.stub(authService, 'update').resolves(true);

        const result = await userService.updateUser('test@example.com', 'Test User', 'password');

        expect(result).to.equal(true);
    });

    it('should login a user and return a token', async () => {
        const user: IUser = {
            uuid: 'test-uuid',
            email: 'test@example.com',
            password: 'password',
            name: 'Test User',
        };
        const token = 'test-token';
        sinon.stub(authService, 'login').resolves(user);
        sinon.stub(hashingUtil, 'generateToken').resolves(token);

        const result = await userService.loginUser('test@example.com', 'password');

        expect(result).to.deep.equal({ user, token });
    });

    it('should delete a user', async () => {
        sinon.stub(userRepository, 'deleteUser').resolves();

        const result = await userService.deleteUser('test-uuid');

        expect(result).to.deep.equal({ message: 'User deleted' });
    });
});
