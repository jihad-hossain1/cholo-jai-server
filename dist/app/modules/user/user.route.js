"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router
    .get("/all", user_controller_1.UserController.find)
    .get("/findById/:id", user_controller_1.UserController.findById)
    .get("/findByMobile/:mobile", user_controller_1.UserController.findByMobile)
    .patch("/update/:id", user_controller_1.UserController.update)
    .delete("/remove/:id", user_controller_1.UserController.remove);
exports.UserRoutes = router;
