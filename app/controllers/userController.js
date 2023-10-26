import { UserRecette } from '../shared/database.js';
import bcrypt from 'bcrypt';
import { comparePasswords } from '../script/bcryptUtils.js';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import Sequelize from 'sequelize';
const Op = Sequelize.Op;

dotenv.config();

export const getAllUsers = async function (req, res) {
    try {
        const users = await UserRecette.findAll(
            {
                attributes: ['id', 'name', 'email', 'role'], // On précise les champs à récupérer
                order: [['name', 'ASC']] // Tri par ordre alphabétique croissant du champ 'titre'
            }
        );
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des users' });
    }
}

export const postUser = async function (req, res) {
    // Extrayez les données de la requête
    const { name, password, email } = req.body;

    try {
        // Vérifiez si l'utilisateur avec le même nom existe déjà en BDD
        const userWithSameName = await UserRecette.findOne({
            where: {
                name: name
            }
        });

        // Vérifiez si l'utilisateur avec le même email existe déjà en BDD
        const userWithSameEmail = await UserRecette.findOne({
            where: {
                email: email
            }
        });

        // Si l'utilisateur avec le même nom ou le même email existe, renvoyez une réponse d'erreur
        if (userWithSameName) {
            return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà utilisé par un autre utilisateur.' });
        }

        if (userWithSameEmail) {
            return res.status(400).json({ message: 'Cette adresse e-mail est déjà utilisée par un autre utilisateur.' });
        }

        // Si le nom et l'email ne sont pas déjà utilisés, hachez le mot de passe et créez l'utilisateur
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await UserRecette.create({
            name: name,
            password: hashedPassword,
            email: email
        });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.' });
    }
}


export const loginUser = async function (req, res) {
    const { name, password } = req.body;
    try {
        const user = await UserRecette.findOne({
            where: {
                name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), '=', name.toLowerCase())
            }
        });
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '3d' });
                res.json({ user, token });
            } else {
                res.status(401).json({ message: 'Combinaison nom d\'utilisateur/mot de passe incorrecte' });
            }
        } else {
            res.status(404).json({ message: 'Combinaison nom d\'utilisateur/mot de passe incorrecte' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
}

export const putUser = async function (req, res) {
    const id = parseInt(req.params.id);
    const { name, password, email, role } = req.body;
    try {
        const user = await UserRecette.findOne({
            where: {
                id: id
            }
        });
        if (user) {
            user.name = name;
            user.password = password;
            user.email = email;
            user.role = role;
            await user.save();
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
    const { password } = req.body;
    try {

        const user = await UserRecette.findOne({
            where: {
                id: id
            }
        });
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                await user.destroy();
                return res.status(204).json({ message: 'Utilisateur supprimé avec succès' });
                console.log('Utilisateur supprimé avec succès');

            } else {
                console.log('Mot de passe incorrect');
                return res.status(401).json({ message: 'Mot de passe incorrect' });
            }
        } else {
            console.log('Utilisateur non trouvé');
            return res.status(404).json({ message: 'User non trouvée' });
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        return res.status(500).json({ message: 'Erreur lors de la suppression de l\'user' });
    }
}


// changer le role d'un user

export const changeRole = async function (req, res) {
    const userId = req.params.userId;
    const { role } = req.body;

    try {
        // Assurez-vous que l'ID de l'utilisateur est un nombre entier positif
        if (!Number.isInteger(parseInt(userId)) || parseInt(userId) <= 0) {
            return res.status(400).json({ message: 'ID utilisateur invalide' });
        }

        const user = await UserRecette.findByPk(userId);

        // Vérifiez si l'utilisateur existe
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Assurez-vous que l'utilisateur authentifié a les autorisations nécessaires pour effectuer cette action
        // Vous pouvez implémenter votre logique d'autorisation ici

        // Mettez à jour le rôle de l'utilisateur
        user.role = role;
        await user.save();

        return res.status(200).json({ message: 'Rôle utilisateur mis à jour avec succès' });
    } catch (error) {
        console.error(error);

        // Ne révélez pas d'informations sensibles dans les messages d'erreur
        return res.status(500).json({ message: 'Erreur lors de la mise à jour du rôle utilisateur' });
    }
}

export const updateUserEmail = async function (req, res) {
    const userId = req.params.userId;
    const { email, password } = req.body;

    try {
        // Vérifiez si l'adresse e-mail existe déjà dans la base de données
        const existingUser = await UserRecette.findOne({
            where: {
                email: email
            }
        });

        if (existingUser && existingUser.id !== userId) {
            // L'adresse e-mail existe déjà pour un autre utilisateur
            return res.status(400).json({ message: 'Cette adresse e-mail est déjà utilisée par un autre utilisateur.' });
        }

        // Recherchez l'utilisateur par ID
        const user = await UserRecette.findOne({
            where: {
                id: userId
            }
        });

        if (user) {
            // Comparez le mot de passe actuel saisi avec le mot de passe haché en base de données
            const isPasswordCorrect = await comparePasswords(password, user.password);

            if (isPasswordCorrect) {
                // Mettez à jour l'adresse e-mail dans la base de données
                user.email = email;
                await user.save();

                res.json({ message: 'Adresse e-mail mise à jour avec succès.' });
            } else {
                res.status(400).json({ message: 'Le mot de passe actuel est incorrect.' });
            }
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'adresse e-mail.' });
    }
}

export const updateUserPassword = async function (req, res) {
    const userId = req.params.userId;
    const { password, newPassword } = req.body;

    try {
        // Recherchez l'utilisateur par ID
        const user = await UserRecette.findOne({
            where: {
                id: userId
            }
        });

        if (user) {

            // Comparez le mot de passe actuel saisi avec le mot de passe haché en base de données
            const isPasswordCorrect = await comparePasswords(password, user.password);

            if (isPasswordCorrect) {

                // Générez un sel pour le hachage (le coût de 10 est une bonne pratique)
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

                // Mettez à jour le mot de passe dans la base de données
                user.password = hashedPassword;
                await user.save();

                res.json({ message: 'Mot de passe mis à jour avec succès.' });
            } else {
                res.status(400).json({ message: 'Le mot de passe actuel est incorrect.' });
            }
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du mot de passe.' });
    }
}
