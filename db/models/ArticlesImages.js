import { genForeignKey } from "../../utils/db.js";

const ArticlesImages = (sequelize, DataTypes) => {
    const model = sequelize.define('articles_images', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        filename: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        filepath: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    });

    model.associate = (models) => {
        model.belongsTo(models.Articles, genForeignKey('articles_id'));
    };

    return model;
};

export default ArticlesImages;