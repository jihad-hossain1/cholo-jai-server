import express from "express";
import { UserController } from "./user.controller";
const router = express.Router();

router
  .get("/all", UserController.find)
  .get("/findById/:id", UserController.findById)
  .patch("/update/:id", UserController.update)
  .delete("/remove/:id", UserController.remove);

export const UserRoutes = router;
