import express from 'express';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const userRouter = express.Router();

// Protegemos todas las rutas de usuario con autenticación
userRouter.use(authMiddleware);

userRouter.get('/', userController.listUsers);
userRouter.get('/:id', userController.getUser);
userRouter.put('/', userController.updateUser);
userRouter.post('/profile-picture', upload.single('image'), userController.updateProfilePicture);
userRouter.delete('/:id', userController.deleteUser);

export default userRouter;