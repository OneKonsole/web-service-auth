// src/services/userService.ts
import {IUser} from "../../types";
import {login, register, update} from "./authService";
import {generateToken} from "../utils/hashingUtil";
import {
    getUser as getUserRepo,
    deleteUser as deleteUserRepo
} from "../repositories/userRepository";

export const getUser = async (uuid: string): Promise<IUser> => {
    const user: IUser = await getUserRepo(uuid);
    user.password = '';
    return user;
}

export const registerUser = async (email: string, name: string, password: string): Promise<IUser> => {
    return await register(email, name, password);
}
export const updateUser = async (email: string, name: string, password: string): Promise<Boolean> => {
    return await update(email, name, password)
}

export const loginUser = async (email: string, password: string) => {
    const user = await login(email, password);
    const token = await generateToken(user.uuid, user.email);

    return {
        user: user,
        token: token
    }
}


export const deleteUser = async (uuid: string) => {
    await deleteUserRepo(uuid);

    return {message: 'User deleted'};
}