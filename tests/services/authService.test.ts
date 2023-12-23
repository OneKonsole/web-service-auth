import * as chai from 'chai';
import * as sinon from 'sinon';
import * as userRepository from '../../src/repositories/userRepository';
import * as hashingUtil from '../../src/utils/hashingUtil';
import * as userService from '../../src/services/userService';
import {InvalidCredentialsError, UserAlreadyExistsError} from '../../src/error/errors';
import {IUser} from '../../types';
import {updateUser} from "../../src/repositories/userRepository";
import mongoose from "mongoose";
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const {expect} = chai;

describe('User Service', () => {
    afterEach(() => {
        sinon.restore();
    });
    after(async() => {
        // The test still running after finishing all tests
        await mongoose.connection.close();
    });

    describe('register', () => {
        it('should register a new user', async () => {
            const email = 'test@example.com';
            const name = 'test';
            const password = 'password';
            const hashedPassword = 'hashedpassword';

            sinon.stub(userRepository, 'getUser').throws(new Error());
            sinon.stub(userRepository, 'registerUser').resolves({email, name, password: hashedPassword} as IUser);
            sinon.stub(hashingUtil, 'hashPassword').resolves(hashedPassword);

            const user = await userService.registerUser(email, name, password);

            expect(user.email).to.equal(email);
            expect(user.name).to.equal(name);
            expect(user.password).to.equal(hashedPassword);
        });

        it('should throw an error if user already exists', async () => {
            const email = 'test@example.com';
            const name = 'test';
            const password = 'password';

            sinon.stub(userRepository, 'getUser').resolves({ email, name, password } as IUser);

            try {
                await userService.registerUser(email, name, password);
            } catch (e) {
                expect(e).to.be.instanceOf(UserAlreadyExistsError);
            }
        });
    });

    describe('login', () => {
        it('should login a user with correct credentials', async () => {
            const email = 'test@example.com';
            const password = 'password';

            sinon.stub(userRepository, 'getUserByEmail').resolves({email, password} as IUser);
            sinon.stub(hashingUtil, 'comparePasswords').resolves(true);

            const {user, token} = await userService.loginUser(email, password);

            expect(user.email).to.equal(email);
            expect(user.password).to.equal(password);
            expect(token).to.be.a('string');
        });

        it('should throw an error for incorrect password', async () => {
            const email = 'test@example.com';
            const password = 'password';

            sinon.stub(userRepository, 'getUserByEmail').resolves({email, password} as IUser);
            sinon.stub(hashingUtil, 'comparePasswords').resolves(false);

            await expect(userService.loginUser(email, password)).to.eventually.be.rejectedWith(InvalidCredentialsError);
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const uuid = '1234';
            const oldPassword = 'oldpassword';
            const newPassword = 'newpassword';
            const hashedPassword = 'hashednewpassword';

            sinon.stub(userRepository, 'getUser').resolves({uuid, password: oldPassword} as IUser);
            sinon.stub(userRepository, 'updateUser').resolves();
            sinon.stub(hashingUtil, 'comparePasswords').resolves(true);
            sinon.stub(hashingUtil, 'hashPassword').resolves(hashedPassword);

            const result = await userService.updateUser(uuid, oldPassword, newPassword);

            expect(result).to.be.true;
        });

        it('should throw an error for incorrect old password', async () => {
            const uuid = '1234';
            const oldPassword = 'oldpassword';
            const newPassword = 'newpassword';

            sinon.stub(userRepository, 'getUser').resolves({uuid, password: oldPassword} as IUser);
            sinon.stub(hashingUtil, 'comparePasswords').resolves(false);

            await expect(userService.updateUser(uuid, oldPassword, newPassword)).to.be.rejectedWith(InvalidCredentialsError);
        });
    });
});
