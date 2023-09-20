import { genForeignKey } from "../../utils/db.js";

const Doors = (sequelize, DataTypes) => {
    const model = sequelize.define('doors', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image_entry: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image_exit: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    });

    model.associate = (models) => {
        model.belongsTo(models.Users, genForeignKey('users_id'));
        model.hasMany(models.Articles, genForeignKey('doors_id'));
    };

    return model;
};

export default Doors;