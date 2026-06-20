import { Router } from 'express';
import {
  getUser,
  addProfilePhoto,
  refreshAccessToken,
} from '../controllers/user.controller.js';
import { jwt_auth } from '../middlewares/jwt_auth.middleware.js';
import { upload_mul } from '../middlewares/multer.middleware.js';

const userRoutes = Router();

userRoutes.route('/getUser').get(jwt_auth, getUser);

userRoutes
  .route('/addProfilePhoto')
  .post(jwt_auth, upload_mul.single('profilePhoto'), addProfilePhoto);

userRoutes.route('/refreshToken').post(refreshAccessToken);

export default userRoutes;
