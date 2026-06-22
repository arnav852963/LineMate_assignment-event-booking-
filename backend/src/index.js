import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './.env' });
}
import { app } from './app.js';
import { db } from './db/index.js';
import { ApiError } from './utilities/ApiError.js';
import { httpserver } from './app.js';

db()
  .then(async () => {
    httpserver.on('error', (error) => {
      throw new ApiError(500, `error is ${error.message}`);
    });

    const PORT = process.env.PORT || 8000;

    httpserver.listen(PORT, () => {});
    app.on('error', (error) => {
      throw error;
    });
  })
  .catch((e) => {
    throw new ApiError(500, `error in mongo ->${e.message}`);
  });
