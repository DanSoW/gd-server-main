import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";
import adminService from "../services/admin/admin-service.js";
import config from "config";
import SignUpDto from "../dtos/auth/sign-up-dto.js";
import UserIdDto from "../dtos/admin/user-id-dto.js.js";
import UserTransferDto from "../dtos/admin/user-transfer-dto.js";

/* Контроллер авторизации */
class AdminController {
    async doorGetAll(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await adminService.doorGetAll(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async doorAdd(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await adminService.doorAdd(req.body, req.files['image_entry'][0], req.files['image_exit'][0]);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async doorCharacteristicAdd(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await adminService.doorCharacteristicAdd(req.body, req.files['images']);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async doorCharacteristicDelete(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await adminService.doorCharacteristicDelete(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async doorDelete(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await adminService.doorDelete(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async doorInfoEdit(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await adminService.doorInfoEdit(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async doorImageEntryEdit(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await adminService.doorImageEntryEdit(req.body, req.files["image_entry"][0]);

            return res.status(201).json(data);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async doorImageExitEdit(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await adminService.doorImageExitEdit(req.body, req.files["image_exit"][0]);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async doorCharacteristicInfoEdit(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await adminService.doorCharacteristicInfoEdit(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async doorCharacteristicImageAdd(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await adminService.doorCharacteristicImageAdd(req.body, req.files["image"][0]);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async doorCharacteristicImageDelete(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await adminService.doorCharacteristicImageDelete(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async filterInfoAdd(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await adminService.filterInfoAdd(req.body, req.files["image"][0]);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }
}

export default new AdminController();