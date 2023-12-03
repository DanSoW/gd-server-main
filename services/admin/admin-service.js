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
import fs from 'fs';

class AdminService {
    async doorGetAll(data) {
        try {
            const { users_id } = data;

            const doors = await db.Doors.findAll({
                include: {
                    model: db.Articles,
                    include: {
                        model: db.ArticlesImages
                    }
                },
                order: [
                    ['updated_at', 'DESC'],
                ]
            });

            for (let i = 0; i < doors.length; i++) {
                doors[i].image_entry = `${config.get("url.api")}/${doors[i].image_entry}`;
                doors[i].image_exit = `${config.get("url.api")}/${doors[i].image_exit}`;

                for (let j = 0; j < doors[i].articles.length; j++) {
                    doors[i].articles[j].dataValues.images = [];
                    for (let k = 0; k < doors[i].articles[j].articles_images.length; k++) {
                        /*doors[i].articles[j].articles_images[k].dataValues.url =
                            `${config.get("url.api")}/${doors[i].articles[j].articles_images[k].filepath}`;*/
                        doors[i].articles[j].dataValues.images.push({
                            url: `${config.get("url.api")}/${doors[i].articles[j].articles_images[k].filepath}`
                        });
                    }
                }
            }

            return doors;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async doorAdd(data, imageEntry, imageExit) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, title, description } = data;

            const door = await db.Doors.create({
                users_id: users_id,
                title: title,
                description: description,
                image_entry: imageEntry.path,
                image_exit: imageExit.path
            }, { transaction: t });

            await t.commit();

            return door;
        } catch (e) {
            fs.unlinkSync(imageEntry.path);
            fs.unlinkSync(imageExit.path);

            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async doorCharacteristicAdd(data, images) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                doors_id,
                title,
                description,
                width,
                height,
                opening_direction,
                main_lock,
                additional_lock,
                door_leaf_thickness,
                sealing_contours,
                color,
                target,
                mirror,
                price,
                price_without_discount,
                discount,
                is_defect,
                additional_features
            } = data;

            const door = await db.Doors.findOne(({
                where: {
                    id: doors_id
                }
            }));

            if (!door) {
                throw ApiError.NotFound(`Двери с идентификатором ${doors_id} не найдено`);
            }

            const article = await db.Articles.create({
                doors_id,
                title,
                description,
                width,
                height,
                opening_direction,
                main_lock,
                additional_lock,
                door_leaf_thickness,
                sealing_contours,
                color,
                target,
                mirror,
                price,
                price_without_discount,
                discount,
                is_defect,
                additional_features
            }, { transaction: t });

            const result = {
                ...article.dataValues,
                images: []
            };

            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                await db.ArticlesImages.create({
                    filepath: image.path,
                    filename: image.filename,
                    articles_id: article.id
                }, { transaction: t });

                result.images.push({
                    url: `${config.get("url.api")}/${image.path}`
                });
            }

            await t.commit();

            return result;
        } catch (e) {
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                fs.unlinkSync(image.path);
            }

            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async doorCharacteristicDelete(data) {
        const t = await db.sequelize.transaction();

        try {
            const {
                doors_id,
                articles_id
            } = data;

            const door = await db.Doors.findOne(({
                where: {
                    id: doors_id
                }
            }));

            if (!door) {
                throw ApiError.NotFound(`Двери с идентификатором ${doors_id} не найдено`);
            }

            const article = await db.Articles.findOne(({
                where: {
                    id: articles_id
                }
            }));

            if (!article) {
                throw ApiError.NotFound(`Артикула с идентификатором ${articles_id} не найдено`);
            }

            const images = [];
            const articlesImages = await db.ArticlesImages.findAll({
                where: {
                    articles_id: articles_id
                }
            });

            for (let i = 0; i < articlesImages.length; i++) {
                images.push(articlesImages[i].filepath);
                await articlesImages[i].destroy({ transaction: t });
            }

            await article.destroy({ transaction: t });

            await t.commit();

            for (let i = 0; i < images.length; i++) {
                if (fs.existsSync(images[i])) {
                    fs.unlinkSync(images[i]);
                }
            }

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async doorDelete(data) {
        const t = await db.sequelize.transaction();

        try {
            const {
                doors_id,
            } = data;

            const door = await db.Doors.findOne(({
                where: {
                    id: doors_id
                }
            }));

            if (!door) {
                throw ApiError.NotFound(`Двери с идентификатором ${doors_id} не найдено`);
            }

            const articles = await db.Articles.findAll(({
                where: {
                    doors_id: door.id
                }
            }));

            const images = [];
            for (let i = 0; i < articles.length; i++) {
                const articlesImages = await db.ArticlesImages.findAll({
                    where: {
                        articles_id: articles[i].id
                    }
                });

                for (let j = 0; j < articlesImages.length; j++) {
                    images.push(articlesImages[j].filepath);
                    await articlesImages[j].destroy({ transaction: t });
                }

                await articles[i].destroy({ transaction: t });
            }

            images.push(door.image_entry);
            images.push(door.image_exit);

            await door.destroy({ transaction: t });

            await t.commit();

            for (let i = 0; i < images.length; i++) {
                if (fs.existsSync(images[i])) {
                    fs.unlinkSync(images[i]);
                }
            }

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async doorInfoEdit(data) {
        const t = await db.sequelize.transaction();

        try {
            const {
                doors_id,
                title,
                description
            } = data;

            const door = await db.Doors.findOne(({
                where: {
                    id: doors_id
                }
            }));

            if (!door) {
                throw ApiError.NotFound(`Двери с идентификатором ${doors_id} не найдено`);
            }

            door.title = title;
            door.description = description;
            await door.save({ transaction: t });

            await t.commit();

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async doorImageEntryEdit(data, image) {
        const t = await db.sequelize.transaction();

        try {
            const {
                doors_id,
            } = data;

            const door = await db.Doors.findOne(({
                where: {
                    id: doors_id
                }
            }));

            if (!door) {
                throw ApiError.NotFound(`Двери с идентификатором ${doors_id} не найдено`);
            }

            const ref = `${door.image_entry}`;

            door.image_entry = image.path;
            await door.save({ transaction: t });

            await t.commit();

            if (fs.existsSync(ref)) {
                fs.unlinkSync(ref);
            }

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async doorImageExitEdit(data, image) {
        const t = await db.sequelize.transaction();

        try {
            const {
                doors_id,
            } = data;

            const door = await db.Doors.findOne(({
                where: {
                    id: doors_id
                }
            }));

            if (!door) {
                throw ApiError.NotFound(`Двери с идентификатором ${doors_id} не найдено`);
            }

            const ref = `${door.image_exit}`;

            door.image_exit = image.path;
            await door.save({ transaction: t });

            await t.commit();

            if (fs.existsSync(ref)) {
                fs.unlinkSync(ref);
            }

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async doorCharacteristicInfoEdit(data, images) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                doors_id,
                articles_id,
                title,
                description,
                width,
                height,
                opening_direction,
                main_lock,
                additional_lock,
                door_leaf_thickness,
                sealing_contours,
                color,
                target,
                mirror,
                price,
                price_without_discount,
                discount,
                is_defect,
                additional_features
            } = data;

            const door = await db.Doors.findOne(({
                where: {
                    id: doors_id
                }
            }));

            if (!door) {
                throw ApiError.NotFound(`Двери с идентификатором ${doors_id} не найдено`);
            }

            await db.Articles.update({
                title,
                description,
                width,
                height,
                opening_direction,
                main_lock,
                additional_lock,
                door_leaf_thickness,
                sealing_contours,
                color,
                target,
                mirror,
                price,
                price_without_discount,
                discount,
                is_defect,
                additional_features
            }, {
                where: {
                    id: articles_id,
                    doors_id: doors_id
                },
            }, { transaction: t });

            await t.commit();

            return data;
        } catch (e) {

            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async doorCharacteristicImageAdd(data, image) {
        const t = await db.sequelize.transaction();

        try {
            const { articles_id } = data;
            const article = await db.Articles.findOne({
                where: {
                    id: articles_id
                }
            });

            if (!article) {
                throw ApiError.NotFound(`Ошибка: артикля с идентификатором ${articles_id} не найдено!`);
            }

            const imageArticle = await db.ArticlesImages.create({
                filename: image.filename,
                filepath: image.path,
                articles_id: articles_id
            }, { transaction: t });

            await t.commit();

            return article;
        } catch (e) {
            fs.unlinkSync(image.path);

            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async doorCharacteristicImageDelete(data) {
        const t = await db.sequelize.transaction();

        try {
            const { image, articles_id } = data;
            const articleImage = await db.ArticlesImages.findOne({
                where: {
                    filepath: image,
                    articles_id: articles_id
                }
            });

            const path = articleImage.path;
            await articleImage.destroy({ transaction: t });

            await t.commit();

            if (fs.existsSync(path)) {
                fs.unlinkSync(path);
            }

            return articleImage;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async filterInfoAdd(data, image) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, title, description } = data;

            const filterInfo = await db.FilterInfo.findOne();
            if (filterInfo) {
                await filterInfo.destroy({ transaction: t });
            }

            const createFilterInfo = await db.FilterInfo.create({
                filepath: image.path,
                filename: image.filename
            });

            await t.commit();

            const url = `${config.get("url.api")}/${createFilterInfo.filepath}`;

            return {
                url: url
            };
        } catch (e) {
            fs.unlinkSync(image.path);

            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new AdminService();