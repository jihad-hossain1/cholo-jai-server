"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("./user.service");
const find = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.UserService.find();
        return res.status(http_status_1.default.OK).json({
            status: "Success",
            message: "All users find successfully",
            result: result,
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: "Something went wrong while find all user",
            error: error || "Internal server error",
        });
    }
});
const findById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield user_service_1.UserService.findById(id);
        return res.status(http_status_1.default.OK).json({
            status: "Success",
            message: "Single user find successfully",
            result: result,
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: "Something went wrong while find single user",
            error: error || "Internal server error",
        });
    }
});
const findByMobile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mobile = req.params.mobile;
        const result = yield user_service_1.UserService.findByMobile(mobile);
        return res.status(http_status_1.default.OK).json({
            status: "Success",
            message: "Single user find successfully",
            result: result,
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: "Something went wrong while find single user",
            error: error || "Internal server error",
        });
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = yield user_service_1.UserService.update(id, data);
        return res.status(http_status_1.default.OK).json({
            status: "Success",
            message: "User update successfully",
            result: result,
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: "Something went wrong while update user",
            error: error || "Internal server error",
        });
    }
});
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield user_service_1.UserService.remove(id);
        return res.status(http_status_1.default.OK).json({
            status: "Success",
            message: "User delete successfully",
            result: result,
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: "Something went wrong while delete user",
            error: error || "Internal server error",
        });
    }
});
exports.UserController = {
    find,
    findById,
    update,
    remove,
    findByMobile,
};
