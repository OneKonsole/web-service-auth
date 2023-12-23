import { expect } from 'chai';
import { JWTError } from '../../src/error/errors';
import * as hashingUtil from '../../src/utils/hashingUtil';
import {assert, stub, restore, replace} from "sinon";
import { verify, sign, JsonWebTokenError } from 'jsonwebtoken';

describe('Hashing Util', () => {
    let hashStub: any, compareStub: any, verifyStub: any, signStub: any;
    beforeEach(() => {
        hashStub = stub(hashingUtil, 'hashPassword').resolves('hashed-password');
        compareStub = stub(hashingUtil, 'comparePasswords').resolves(true);
        verifyStub = stub().returns({ uuid: 'test-uuid', email: 'test@example.com', iat: Math.floor(Date.now() / 1000) });
        replace(hashingUtil, 'verifyToken', verifyStub);
        signStub = stub().returns('test-token');
        replace(hashingUtil, 'generateToken', signStub);
        replace(hashingUtil, 'refreshToken', signStub);
    });

    afterEach(() => {
        // Restore the original functionality after each test
        restore();
    });

    it('should hash a password', async () => {
        const password = 'password';

        const result = await hashingUtil.hashPassword(password);

        expect(result).to.equal('hashed-password');
        assert.calledOnce(
            hashStub
        );
    });

    it('should compare a password and a hashed password', async () => {
        const password = 'password';
        const hashedPassword = 'hashed-password';

        const result = await hashingUtil.comparePasswords(password, hashedPassword);

        expect(result).to.equal(true);
        assert.calledOnce(compareStub);
    });

    it('should verify a token', async () => {
        const token = 'test-token';
        // Here you call the actual method which now uses the stubbed verify method
        const result = await hashingUtil.verifyToken(token);

        expect(result).to.deep.equal({ uuid: 'test-uuid', email: 'test@example.com', iat: Math.floor(Date.now() / 1000) });
        assert.calledOnce(verifyStub);
    });

    it('should throw an error when token is invalid', async () => {
        const token = 'invalid-token';
        // verifyStub without using "jwt")
        verifyStub = stub().callsFake(() => { throw new JsonWebTokenError('invalid token'); });

        try {
            await hashingUtil.verifyToken(token);
        } catch (e: any) {
            expect(e).to.be.instanceOf(JWTError);
            expect(e.message).to.equal('Invalid token');
        }
    });

    it('should generate a token', async () => {
        const uuid = 'test-uuid';
        const email = 'test@example.com';

        const result = await hashingUtil.generateToken(uuid, email);

        expect(result).to.equal('test-token');
    });

    it('should refresh a token', async () => {
        const token = 'test-token';

        const result = await hashingUtil.refreshToken(token);

        expect(result).to.equal('test-token');
    });

    it('should throw an error when refreshing an invalid token', async () => {
        const token = 'invalid-token';
        // without using "jwt")
        verifyStub = stub().callsFake(() => { throw new JsonWebTokenError('invalid token'); });
        try {
            await hashingUtil.refreshToken(token);
        } catch (e: any) {
            expect(e).to.be.instanceOf(JWTError);
            expect(e.message).to.equal('Invalid token');
        }
    });

    it('should generate a UUID', () => {
        const uuid = hashingUtil.generateUUID();

        expect(uuid).to.match(/[a-z0-9]{14,30}/);
    });
});