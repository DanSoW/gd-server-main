import { genForeignKey } from "../../utils/db.js";

const FilterInfo = (sequelize, DataTypes) => {
    const model = sequelize.define('filter_infos', {
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

    model.associate = (models) => { };

    return model;
};

export default FilterInfo;