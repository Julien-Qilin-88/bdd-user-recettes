import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import 'dotenv/config';

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: console.log
})

export const UserRecette = sequelize.define('Recette', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'user', // Par défaut, le rôle est défini à "user"
        validate: {
            isIn: [['user', 'admin']] // Seuls les rôles "user" et "admin" sont acceptés
        }
    }
});

export const initSequelize = async ({ force = true } = {}) => {
    // await sequelize.drop();
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
}
