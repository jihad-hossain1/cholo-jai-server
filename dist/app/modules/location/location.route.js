"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const location_controller_1 = require("./location.controller");
const router = express_1.default.Router();
router
    .get("/all", location_controller_1.LocationController.find)
    .get("/findById/:id", location_controller_1.LocationController.findById)
    .post("/create-new-location", location_controller_1.LocationController.createNewLocation)
    .patch("/update/:id", location_controller_1.LocationController.update)
    .delete("/remove/:id", location_controller_1.LocationController.remove);
exports.LocationRoutes = router;
