import express from 'express';

import { UserController } from '../controllers/user.controller';
import { validateRequest } from '../middlewares/validateReqMiddleware';
import { LoginValidation, SignUpValidation } from '../validations/user.validation';

const userRouter = express.Router();
const userController = new UserController();

userRouter.route('/user/signup').post(
   validateRequest(SignUpValidation),
   userController.createUser
);

userRouter.route('/user/login').post(
   validateRequest(LoginValidation),
   userController.loginUser
);

// userRouter.route('/user').get(
//    userController.getUser
// );

export default userRouter;