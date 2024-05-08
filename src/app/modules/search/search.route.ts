import express from "express";
import { SearchController } from "./search.controller";

const router = express.Router();

router.post("/", SearchController.search);

export const searchRoutes = router;
