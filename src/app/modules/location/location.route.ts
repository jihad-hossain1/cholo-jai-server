import express from "express";
import { LocationController } from "./location.controller";
const router = express.Router();

router.post("/create-new-location", LocationController.createNewLocation);

export const LocationRoutes = router;
