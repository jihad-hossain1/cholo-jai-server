import express from "express";
import { SearchController } from "./search.controller";

const router = express.Router();

router.post("/create", SearchController.search);
// router.get("/all-locations", SearchController.getAllLocations);

export const searchRoutes = router;
