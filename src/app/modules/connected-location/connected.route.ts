import express from "express";
import { ConnectedLocationController } from "./connected.controller";
const router = express.Router();

router
  .get("/all", ConnectedLocationController.find)
  .get("/findById/:id", ConnectedLocationController.findById)
  .post(
    "/create-new-location",
    ConnectedLocationController.createNewConnectedLocation
  )
  .patch("/update/:id", ConnectedLocationController.update)
  .delete("/remove/:id", ConnectedLocationController.remove);

export const ConnectedLocationRoutes = router;
