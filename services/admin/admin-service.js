import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import config from 'config';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import db from '../../db/index.js';
import ApiError from '../../exceptions/api-error.js';
import UserInfoDto from '../../dtos/admin/user-info-dto.js';
import RoleDto from '../../dtos/auth/role-dto.js';
import UserDto from '../../dtos/admin/user-dto.js';
import jwtService from '../token/jwt-service.js';
import tokenService from '../token/token-service.js';

class AdminService {

}

export default new AdminService();