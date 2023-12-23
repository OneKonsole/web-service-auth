// tests/config/database.test.ts
import * as chai from 'chai';
import * as sinon from "sinon";
import mongoose from 'mongoose';
const { connectToDatabase } = require('../../src/config/database');

const {expect} = chai;

describe('DB Config', () => {
    let logStub: sinon.SinonStub;
    let errorStub: sinon.SinonStub;
    let connectStub: sinon.SinonStub;

    before(() => {
        logStub = sinon.stub(console, 'log');
        errorStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
        if (connectStub) {
            connectStub.restore();
            mongoose.connection.close();
        }
    });

    after(() => {
        logStub.restore();
        errorStub.restore();
    });

    it('should connect to database', async () => {
        connectStub = sinon.stub(mongoose, 'connect').resolves(mongoose);
        await connectToDatabase();
        expect(connectStub.calledOnce).to.be.true;
    });

    it('should handle connection error', async () => {
        connectStub = sinon.stub(mongoose, 'connect').rejects(new Error('mock error'));
        await connectToDatabase();
        expect(errorStub.calledOnce).to.be.true;
    });
});
