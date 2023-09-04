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
    }
}, {
    hooks: {
        beforeCreate: async (userRecette, options) => {
            const saltRounds = 10; // Vous pouvez ajuster le nombre de tours selon vos besoins
            const hashedPassword = await bcrypt.hash(userRecette.password, saltRounds);
            userRecette.password = hashedPassword;
        }
    }
});

export const initSequelize = async ({ force = true } = {}) => {
    // await sequelize.drop();
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
}