import express from 'express';
import * as userController from './controllers/userController.js';
import authMiddleware from './middlewares/authMiddleware.js';

const router = express.Router();


// Utilisez le middleware d'authentification pour protéger les routes
router.use(authMiddleware);

// User router

router.get('/', userController.getAllUsers);

router.post('/inscription', userController.postUser);

router.post('/connexion', userController.loginUser);

router.put('/:id', userController.putUser);

router.delete('/delete/:id', userController.deleteUser);

router.put('/changerole/:userId', userController.changeRole);

router.put('/:userId/email', userController.updateUserEmail);
router.put('/:userId/password', userController.updateUserPassword);

export default router;