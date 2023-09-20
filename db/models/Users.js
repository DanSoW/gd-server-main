import { genForeignKey } from "../../utils/db.js";

const Users = (sequelize, DataTypes) => {
    const model = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        email: {
            type: DataTypes.TEXT,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    model.associate = (models) => {
        // Создание отношения одного (users) ко  (users_roles)
        model.hasMany(models.UsersRoles, genForeignKey('users_id'));

        // Создание отношения одного (users) ко  (roles)
        model.hasMany(models.Roles, genForeignKey('users_id', true));

        // Создание отношения одного (users) ко  (tokens)
        model.hasMany(models.Tokens, genForeignKey('users_id'));

        // Создание отношения одного (users) ко многим (doors)
        model.hasMany(models.Doors, genForeignKey('users_id'));
    }

    return model;
};

export default Users;