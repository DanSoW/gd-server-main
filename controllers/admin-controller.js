import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";
import adminService from "../services/admin/admin-service.js";
import config from "config";
import SignUpDto from "../dtos/auth/sign-up-dto.js";
import UserIdDto from "../dtos/admin/user-id-dto.js.js";
import UserTransferDto from "../dtos/admin/user-transfer-dto.js";

/* Контроллер авторизации */
class AdminController {
}

export default new AdminController();