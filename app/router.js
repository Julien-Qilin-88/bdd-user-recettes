import express from 'express';
import * as userController from './controllers/userController.js';
import authMiddleware from './middlewares/authMiddleware.js';
import authorizationMiddleware from './middlewares/authorizationMiddleware.js';

const router = express.Router();


// Utilisez le middleware d'authentification pour protéger les routes
router.use(authMiddleware);

// User router

router.get('/allUsers', authorizationMiddleware('admin'), userController.getAllUsers);

router.post('/inscription', userController.postUser);

router.post('/connexion', userController.loginUser);

router.put('/:id', userController.putUser);

router.delete('/delete/:id', userController.deleteUser);

router.put('/changerole/:userId', userController.changeRole);

router.put('/email/:userId', userController.updateUserEmail);
router.put('/password/:userId', userController.updateUserPassword);

export default router;