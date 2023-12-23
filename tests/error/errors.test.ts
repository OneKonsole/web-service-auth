import * as chai from 'chai';
import {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    InternalServerError,
    JWTError,
    UserAlreadyExistsError,
    InvalidCredentialsError
} from '../../src/error/errors';
import mongoose from "mongoose";

const {expect} = chai;

describe('Custom Errors', () => {

    it('NotFoundError should have name NotFoundError and statusCode 404', () => {
        const error = new NotFoundError('Not found');
        expect(error.name).to.equal('NotFoundError');
        expect(error.statusCode).to.equal(404);
    });

    it('BadRequestError should have name BadRequestError and statusCode 400', () => {
        const error = new BadRequestError('Bad request');
        expect(error.name).to.equal('BadRequestError');
        expect(error.statusCode).to.equal(400);
    });

    it('UnauthorizedError should have name UnauthorizedError and statusCode 401', () => {
        const error = new UnauthorizedError('Unauthorized');
        expect(error.name).to.equal('UnauthorizedError');
        expect(error.statusCode).to.equal(401);
    });

    it('ForbiddenError should have name ForbiddenError and statusCode 403', () => {
        const error = new ForbiddenError('Forbidden');
        expect(error.name).to.equal('ForbiddenError');
        expect(error.statusCode).to.equal(403);
    });

    it('InternalServerError should have name InternalServerError and statusCode 500', () => {
        const error = new InternalServerError('Internal server error');
        expect(error.name).to.equal('InternalServerError');
        expect(error.statusCode).to.equal(500);
    });

    it('JWTError should have name JWTError and statusCode 500', () => {
        const error = new JWTError('JWT error');
        expect(error.name).to.equal('JWTError');
        expect(error.statusCode).to.equal(500);
    });

    it('UserAlreadyExistsError should have name UserAlreadyExistsError and statusCode 409', () => {
        const error = new UserAlreadyExistsError('User already exists');
        expect(error.name).to.equal('UserAlreadyExistsError');
        expect(error.statusCode).to.equal(409);
    });

    it('InvalidCredentialsError should have name InvalidCredentialsError and statusCode 401', () => {
        const error = new InvalidCredentialsError('Invalid credentials');
        expect(error.name).to.equal('InvalidCredentialsError');
        expect(error.statusCode).to.equal(401);
    });
});
