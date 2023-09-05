import express from 'express';
import bodyParser from 'body-parser';
import * as userController from './controllers/userController.js';

const router = express.Router();

// User router

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/search/:name', userController.getUserByName);

router.post('/inscription', userController.postUser);

router.post('/connexion', userController.loginUser);

router.put('/:id', userController.putUser);

router.delete('/:id', userController.deleteUser);



export default router;