import {IUser} from '../../types';
import {comparePasswords, hashPassword} from '../utils/hashingUtil';
import {getUser, getUserByEmail, registerUser, updateUser as updateUserRepo} from "../repositories/userRepository";
import {InvalidCredentialsError, UserAlreadyExistsError} from "../error/errors";

export const register = async (email: string, name: string, password: string): Promise<IUser> => {
    try {
        await getUser(email);
    } catch (e) {
        const hashedPassword = await hashPassword(password);
        return await registerUser(email, name, hashedPassword);
    }

    throw new UserAlreadyExistsError('User already exists');
};

export const login = async (email: string, password: string) => {

    const user = await getUserByEmail(email);

    const isPasswordCorrect = await comparePasswords(password, user.password);

    if (!isPasswordCorrect) {
        throw new InvalidCredentialsError('Invalid password');
    }

    return user;
};

export const update = async (uuid: string, oldPassword: string, newPassword: string): Promise<boolean> => {
    const user = await getUser(uuid);

    const isPasswordValid = await comparePasswords(oldPassword, user.password);

    if (!isPasswordValid) {
        throw new InvalidCredentialsError('Invalid password');
    }

    const hashedPassword = await hashPassword(newPassword);
    await updateUserRepo(uuid, user.name, user.email, hashedPassword);

    return true;
}
