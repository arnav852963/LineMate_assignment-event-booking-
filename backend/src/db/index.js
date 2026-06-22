import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({
  path: './.env',
});
import { DB_NAME } from '../../constants.js';
import { ApiError } from '../utilities/ApiError.js';

export const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: DB_NAME,
    });
`);
  } catch (e) {
    throw new ApiError(500, `error in mongodb connection -> ${e.message}`);
  }
};
