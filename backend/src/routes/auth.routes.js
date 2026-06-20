import { Router } from 'express';
import {
  register,
  login,
  googleLogin,
  logout,
} from '../controllers/auth.controller.js';
import { jwt_auth } from '../middlewares/jwt_auth.middleware.js';

const authRoutes = Router();

authRoutes.route('/register').post(register);
authRoutes.route('/login').post(login);
authRoutes.route('/googleAuth').post(googleLogin);

authRoutes.route('/logout').post(jwt_auth, logout);

export default authRoutes;
