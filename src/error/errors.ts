class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
    }

    get statusCode() {
        return 404;
    }
}

class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BadRequestError';
    }

    get statusCode() {
        return 400;
    }
}

class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnauthorizedError';
    }

    get statusCode() {
        return 401;
    }
}

class ForbiddenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ForbiddenError';
    }

    get statusCode() {
        return 403;
    }
}

class InternalServerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InternalServerError';
    }

    get statusCode() {
        return 500;
    }
}

class JWTError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'JWTError';
    }

    get statusCode() {
        return 500;
    }
}

class UserAlreadyExistsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserAlreadyExistsError';
    }

    get statusCode() {
        return 409;
    }
}

class InvalidCredentialsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidCredentialsError';
    }

    get statusCode() {
        return 401;
    }
}

export {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    InternalServerError,
    JWTError,
    UserAlreadyExistsError,
    InvalidCredentialsError
}