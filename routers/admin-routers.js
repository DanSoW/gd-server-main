import { Router } from 'express';
import { check } from 'express-validator';
import adminController from '../controllers/admin-controller.js';
import AdminRoute from '../constants/routes/admin.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import accessMiddleware from '../middlewares/access-middleware.js';

const router = new Router();


export default router;