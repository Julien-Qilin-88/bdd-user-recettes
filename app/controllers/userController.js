import { UserRecette } from '../shared/database.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

export const getAllUsers = async function (req, res) {
    try {
        const users = await UserRecette.findAll(
            {
                order: [['name', 'ASC']] // Tri par ordre alphabétique croissant du champ 'titre'
            }
        );
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des users' });
    }
}

export const getUserById = async function (req, res) {
    const id = parseInt(req.params.id);
    const user = await UserRecette.findOne({
        where: {
            id: id
        }
    });

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User non trouvée' });
    }
}

export const getUserByName = async function (req, res) {
    const name = req.params.name;
    const users = await UserRecette.findAll({
        where: {
            name: {
                [Op.iLike]: `%${name}%`
            }
        }
    });

    if (users.length > 0) {
        res.json(users);
    } else {
        res.status(404).json({ message: 'Aucun user trouvé pour ce nom' });
    }
}

export const postUser = async function (req, res) {
    try {
        const user = await UserRecette.create(req.body);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'user' });
    }
}

export const loginUser = async function (req, res) {
    console.log(req.body);
    const { name, password } = req.body;
    const user = await UserRecette.findOne({
        where: {
            name: name
        }
    });

    if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            res.json(user);
        } else {
            res.status(401).json({ message: 'Mot de passe incorrect' });
        }
    } else {
        res.status(404).json({ message: 'User non trouvée' });
    }
}

export const putUser = async function (req, res) {
    const id = parseInt(req.params.id);
    try {
        const user = await UserRecette.findOne({
            where: {
                id: id
            }
        });
        if (user) {
            await user.update(req.body);
            res.json(user);
        } else {
            res.status(404).json({ message: 'User non trouvée' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la modification de l\'user' });
    }
}

export const deleteUser = async function (req, res) {
    const id = parseInt(req.params.id);
    try {
        const user = await UserRecette.findOne({
            where: {
                id: id
            }
        });
        if (user) {
            await user.destroy();
            res.json({ message: `User ${id} supprimée` });
        } else {
            res.status(404).json({ message: 'User non trouvée' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'user' });
    }
}
