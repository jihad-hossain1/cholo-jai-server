import express from "express";
import { AuthController } from "./user.controller";
const router = express.Router();

router.post("/register", AuthController.register).post("/login", AuthController.login);

export const AuthRoutes = router;
