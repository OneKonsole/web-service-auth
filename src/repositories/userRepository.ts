import {IUser} from '../../types';
import {connectToDatabase, db} from '../config/database';
import {generateUUID} from '../utils/hashingUtil';
import {NotFoundError} from "../error/errors";
import User from "../models/userModel";

// Ensure the database connection is established
connectToDatabase();

export const getUser = async (uuid: string): Promise<IUser> => {
    const user = await User.findOne({uuid: uuid});

    if (!user) {
        throw new NotFoundError('User not found');
    }

    return {
        uuid: user.uuid,  // Convert ObjectId to string
        name: user.name,
        email: user.email,
        password: user.password,
    };
};

export const getUserByEmail = async (email: string): Promise<IUser> => {
    const user = await User.findOne({email: email});

    if (!user) {
        throw new NotFoundError('User not found');
    }

    return {
        uuid: user.uuid,  // Convert ObjectId to string
        name: user.name,
        email: user.email,
        password: user.password,
    };
};

export const registerUser = async (
    email: string,
    name: string,
    encodedPassword: string
): Promise<IUser> => {
    const newUser: IUser = {
        uuid: generateUUID(),
        name: name,
        email: email,
        password: encodedPassword,
    };
    await User.create(newUser);
    return newUser;
};

export const updateUser = async (
    uuid: string,
    name: string,
    email: string,
    encodedPassword: string
): Promise<IUser> => {
    const user = await User.findOne({uuid: uuid});

    if (!user) {
        throw new NotFoundError('User not found');
    }

    await User.updateOne(
        {uuid: uuid},
        {
            $set: {
                name: name,
                email: email,
                password: encodedPassword,
            },
        }
    );

    return {
        uuid: user.uuid,  // Convert ObjectId to string
        name: name,
        email: email,
        password: encodedPassword,
    };
};

export const deleteUser = async (uuid: string) => {
    const user = await User.findOne({uuid: uuid});

    if (!user) {
        throw new NotFoundError('User not found');
    }

    await User.deleteOne({uuid: uuid});
};
