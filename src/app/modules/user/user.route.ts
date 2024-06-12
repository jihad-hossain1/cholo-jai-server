import express from "express";
import { UserController } from "./user.controller";
const router = express.Router();

router
  .get("/all", UserController.find)
  .get("/find-bookmarks/:id", UserController.findBookmarks)
  .get("/findById/:id", UserController.findById)
  .get("/find-id/:id", UserController.findId)
  .post("/bookmark/:id", UserController.bookmark)
  .get("/findByMobile/:mobile", UserController.findByMobile)
  .patch("/update/:id", UserController.update)
  .delete("/remove/:id", UserController.remove);

export const UserRoutes = router;
