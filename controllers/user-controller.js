import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";
import userService from "../services/user/user-service.js";

class UserController {
    async doorGetAll(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userService.doorGetAll(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async doorGetByMinPrice(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userService.doorGetByMinPrice(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async mailerCommonSend(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userService.mailerCommonSend(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async mailerOrderSend(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userService.mailerOrderSend(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async getFilterInfo(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userService.getFilterInfo();

            return res.status(200).json(data);
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();