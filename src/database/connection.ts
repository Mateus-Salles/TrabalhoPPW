import { Sequelize } from "sequelize";

export const Connection = new Sequelize('daily_diary', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false,
        freezeTableName: true
    }
})