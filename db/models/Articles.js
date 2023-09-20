import { genForeignKey } from "../../utils/db.js";

const Articles = (sequelize, DataTypes) => {
    const model = sequelize.define('articles', {
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
        width: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        opening_direction: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        main_lock: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        additional_lock: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        door_leaf_thickness: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        sealing_contours: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        color: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        target: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        mirror: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        price_without_discount: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        discount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        in_stock: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    });

    model.associate = (models) => {
        model.belongsTo(models.Doors, genForeignKey('doors_id'));
        model.hasMany(models.ArticlesImages, genForeignKey('articles_id'));
    };

    return model;
};

export default Articles;