import mongoose from 'mongoose';
import {DB_URL} from './env';

/**
 * Connect to the database
 */
const connectToDatabase = async () => {
    try {
        console.log(DB_URL)
        await mongoose.connect(DB_URL, {});
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};

/**
 * Create link to the db
 */
const db = mongoose.connection;

export {connectToDatabase, db};
