import express from 'express';
import {PORT} from './config/env';
import userRoutes from './routes/userRoutes';
import './config/database';
import {
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    InvalidCredentialsError,
    JWTError,
    NotFoundError,
    UnauthorizedError,
    UserAlreadyExistsError
} from "./error/errors";
import http from 'http';
import {LOG_TYPE, logger} from './utils/logger';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// use middleware to allow CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // TODO: change this to the PROXY_URL
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

// use middlewares for logging
app.use((req, res, next) => {
    logger(`Request received: ${req.method} ${req.url}`, LOG_TYPE.INFO);
    next();
});

// use middleware to handle errors
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger(err.message, LOG_TYPE.ERROR);
    // Handle different types of errors thrown by the application (errors.ts)
    if (
        err instanceof NotFoundError ||
        err instanceof BadRequestError ||
        err instanceof UnauthorizedError ||
        err instanceof ForbiddenError ||
        err instanceof InternalServerError ||
        err instanceof JWTError ||
        err instanceof UserAlreadyExistsError ||
        err instanceof InvalidCredentialsError
    ) {
        res.status(err.statusCode).json({error: err.message});
    }// Handle other errors
    else {
        res.status(500).json({error: 'Something went wrong'});
    }
});

// Routes
app.use(userRoutes);

const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
    logger(`Server running on port ${PORT}`, LOG_TYPE.INFO);
});

export {app, server};