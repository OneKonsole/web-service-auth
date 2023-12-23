import { expect } from 'chai';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { MongoClient, Db, Collection, DeleteResult, InsertOneResult, ObjectId, Filter, DeleteOptions } from 'mongodb';
import { NotFoundError } from '../../src/error/errors';
import * as userRepository from '../../src/repositories/userRepository';
import { IUser } from '../../types';
import { connectToDatabase, db } from '../../src/config/database';
import User from '../../src/models/userModel';
import mongoose from "mongoose";

describe('User Repository', () => {
    let collection: Collection<IUser>;

    before(async () => {
        // Connect to in-memory mongodb
        await connectToDatabase();
        collection = db.collection('users') as unknown as Collection<IUser>;
    });

    afterEach(() => {
        sinon.restore();
    });

    after(async() => {
        // The test still running after finishing all tests
        await mongoose.connection.close();
    });

    it('should get a user by uuid', async () => {
        const user: IUser = {
            uuid: 'test-uuid',
            name: 'test-user',
            email: 'test@example.com',
            password: 'password',
        };

        sinon.stub(User, 'findOne').resolves(user);

        const result = await userRepository.getUser(user.uuid);

        expect(result.email).to.equal(user.email);
        expect(result.name).to.equal(user.name);
        expect(result.password).to.equal(user.password);
        expect(result.uuid).to.equal(user.uuid);
    });

    it('should throw an error when user not found by uuid', async () => {
        const uuid = 'non-existent-uuid';

        sinon.stub(collection, 'findOne').resolves(null);

        try {
            await userRepository.getUser(uuid);
        } catch (e) {
            expect(e).to.be.instanceOf(NotFoundError);
        }
    });

    it('should get a user by email', async () => {
        const user: IUser = {
            uuid: 'test-uuid',
            name: 'test-user',
            email: 'test@example.com',
            password: 'password',
        };

        sinon.stub(User, 'findOne').resolves(user);

        const result = await userRepository.getUserByEmail(user.email);

        expect(result.email).to.equal(user.email);
        expect(result.name).to.equal(user.name);
        expect(result.password).to.equal(user.password);
        expect(result.uuid).to.equal(user.uuid);
    });

    it('should throw an error when user not found by email', async () => {
        const email = 'non-existent@example.com';

        sinon.stub(collection, 'findOne').resolves(null);

        try {
            await userRepository.getUserByEmail(email);
        } catch (e) {
            expect(e).to.be.instanceOf(NotFoundError);
        }
    });

    it('should register a user', async () => {
        const email = 'test@example.com';
        const name = 'test-user';
        const encodedPassword = 'password';

        const newUser: IUser = {
            uuid: 'new-uuid',
            name,
            email,
            password: encodedPassword,
        };
        const insertOneResult: InsertOneResult<IUser> = {
            acknowledged: true,
            insertedId: new ObjectId(),
        };

        sinon.stub(collection, 'insertOne').resolves(insertOneResult);
        const result = await userRepository.registerUser(email, name, encodedPassword);

        result.uuid = newUser.uuid;  // Ignore uuid in result

        expect(result).to.deep.equal(newUser);
    });

    it('should update a user', async () => {
        const uuid = 'test-uuid';
        const name = 'updated-name';
        const email = 'updated@example.com';
        const encodedPassword = 'updated-password';

        const user: IUser = {
            uuid,
            name: 'old-name',
            email: 'old@example.com',
            password: 'old-password',
        };

        const updatedUser: IUser = {
            uuid,
            name,
            email,
            password: encodedPassword,
        };

        sinon.stub(collection, 'findOne').resolves(user);
        sinon.stub(collection, 'updateOne').resolves();

        const updated = await userRepository.updateUser(uuid, name, email, encodedPassword);

        user.uuid = uuid;  // Ignore uuid in result
        updatedUser.uuid = uuid;  // Ignore uuid in result

        expect(updated).to.deep.equal(updatedUser);
    });

    it('should throw an error when user not found by uuid on update', async () => {
        const uuid = 'non-existent-uuid';

        sinon.stub(collection, 'findOne').resolves(null);

        try {
            await userRepository.updateUser(uuid, 'name', 'email', 'password');
        } catch (e) {
            expect(e).to.be.instanceOf(NotFoundError);
        }
    });

    it('should throw an error when user not found by uuid on delete', async () => {
        const uuid = 'non-existent-uuid';

        sinon.stub(collection, 'findOne').resolves(null);

        try {
            await userRepository.deleteUser(uuid);
        } catch (e) {
            expect(e).to.be.instanceOf(NotFoundError);
        }
    });

    it('should delete a user', async () => {
        const uuid = 'test-uuid';

        const user: IUser = {
            uuid,
            name: 'test-user',
            email: 'test@example.com',
            password: 'password',
        };

        const deleteResult: DeleteResult = {
            acknowledged: true,
            deletedCount: 1,
        };

        sinon.stub(collection, 'findOne').resolves(user);
        sinon.stub(collection, 'deleteOne').resolves(deleteResult);

        await userRepository.deleteUser(uuid);

        sinon.assert.calledWith(
            collection.deleteOne as SinonStub<[Filter<Document> | undefined, DeleteOptions | undefined], Promise<DeleteResult>>,
            { uuid }
        );
    });
});
