import { Router } from 'express';
import { check } from 'express-validator';
import authController from '../controllers/auth-controller.js';
import AuthRoute from '../constants/routes/auth.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import LogoutDto from '../dtos/auth/logout-dto.js';
import RefreshDto from '../dtos/auth/refresh-dto.js';
import UserRoute from '../constants/routes/user.js';
import userController from '../controllers/user-controller.js';

const router = new Router();


router.post(
    UserRoute.DOOR_GET_ALL,
    [
        check('count', 'Некорректное количество загруженных дверей').isInt({ min: 0 }),
        check('limit', 'Некорректный лимит загружаемых дверей').isInt({ min: 0 })
    ],
    userController.doorGetAll
);

router.post(
    UserRoute.DOOR_GET_ALL_BY_MIN_PRICE,
    [
        check('count', 'Некорректное количество загруженных дверей').isInt({ min: 0 }),
        check('limit', 'Некорректный лимит загружаемых дверей').isInt({ min: 0 })
    ],
    userController.doorGetByMinPrice
);

export default router;