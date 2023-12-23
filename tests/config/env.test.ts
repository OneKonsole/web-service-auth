// tests/config/env.test.js
import * as chai from 'chai';
import * as env from '../../src/config/env';
import mongoose from "mongoose";

const { expect } = chai;

describe('Environment Variables', () => {

    it('should load environment variables', () => {
        expect(env.PORT).to.exist;
        expect(env.DB_USERNAME).to.exist;
        expect(env.DB_PASSWORD).to.exist;
        expect(env.DB_HOST).to.exist;
        expect(env.DB_NAME).to.exist;
        expect(env.DB_URL).to.exist;
        expect(env.JWT_SECRET).to.exist;
        expect(env.JWT_EXPIRATION).to.exist;
    });
});
