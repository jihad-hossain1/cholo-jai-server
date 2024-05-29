import express from "express";
import { LocationController } from "./location.controller";
const router = express.Router();

router
  .get("/all", LocationController.find)
  .get("/findById/:id", LocationController.findById)
  .post("/create-new-location", LocationController.createNewLocation)
  .patch("/update/:id", LocationController.update)
  .delete("/remove/:id", LocationController.remove);

export const LocationRoutes = router;
