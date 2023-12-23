// src/utils/hashingUtil.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {JWT_EXPIRATION, JWT_SECRET} from "../config/env";
import {IUserPayload} from "../../types";
import {JWTError} from "../error/errors";

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};


export const verifyToken = async (token: string): Promise<IUserPayload> => {
    try {
        return jwt.verify(token, JWT_SECRET) as IUserPayload;
    } catch (e) {
        throw new JWTError("Invalid token");
    }
}

export const generateToken = async (uuid: string, email: string): Promise<string> => {
    const payload: IUserPayload = {
        uuid,
        email,
        iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

export const refreshToken = async (token: string) : Promise<string> => {
    try {
        // verify the existing token
        const payload = jwt.verify(token, JWT_SECRET) as IUserPayload;

        // generate a new token with the existing payload
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    } catch (e) {
        // Token is invalid
        throw new JWTError("Invalid token");
    }
}
/**
 * Generates a UUID
 */
export const generateUUID = (): string => {

    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}