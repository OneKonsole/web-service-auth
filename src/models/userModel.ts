// src/models/userModel.ts
import mongoose, { Schema } from 'mongoose';
import {IUser} from "../../types";

const userSchema: Schema = new Schema<IUser>({
    uuid: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    // TODO : Add more fields as needed
});
export default mongoose.model<IUser>('User', userSchema);
