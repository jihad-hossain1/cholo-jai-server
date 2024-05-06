import express from 'express';
import { UserController } from './user.controller';
const router = express.Router();

router.post(
  '/create-user',
  UserController.createUser
);

router.post(
  '/user-login',
  UserController.loginUser
)

export const UserRoutes = router;
