// src/types.d.ts

import {Document} from "mongoose";

export interface IUser {
    uuid: string;
    name: string;
    email: string;
    password: string;
}

export interface IUserPayload {
    uuid: string;
    email: string;
    iat: number;
}

export type UserProperties = {
    attributes: { [key: string]: any };
    credentials?: Array<{
        type: string;
        value: string;
        temporary: boolean;
    }>;
};