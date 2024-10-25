import { Sequelize } from "sequelize";

const database = process.env.DATABASE;
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASS || '';

if (!database) throw new Error("Database name not defined")

export const Connection = new Sequelize(database, user, password, {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false,
        freezeTableName: true
    }
})