import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
    // Exclure certaines routes du middleware d'authentification
    if (req.path === '/connexion' || req.path === '/inscription') {
        return next();
    }

    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Accès non autorisé' });
    }

    const tokenWithoutBearer = token.slice(7);

    try {
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        req.user = decoded; // Stockez l'ensemble du payload du token dans l'objet de requête
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token non valide' });
    }
};

export default authMiddleware;
