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
exports.LocationController = void 0;
const location_service_1 = require("./location.service");
const http_status_1 = __importDefault(require("http-status"));
const find = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield location_service_1.LocationService.find();
        return res.status(http_status_1.default.OK).json({
            status: "Success",
            message: "All location found successfully",
            result: result,
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: "Something went wrong while register",
            error: error || "Internal server error",
        });
    }
});
const findById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield location_service_1.LocationService.findById(id);
        return res.status(http_status_1.default.OK).json({
            status: "Success",
            message: "Single location found successfully",
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
const createNewLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield req.body;
        const result = yield location_service_1.LocationService.createNewLocation(data);
        return res.status(http_status_1.default.OK).json({
            status: "Success",
            message: "New location added successfully",
            result: result,
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: "Something went wrong while register",
            error: error || "Internal server error",
        });
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = yield location_service_1.LocationService.update(id, data);
        return res.status(http_status_1.default.OK).json({
            status: "Success",
            message: "Location updated successfully",
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
        const result = yield location_service_1.LocationService.remove(id);
        return res.status(http_status_1.default.OK).json({
            status: "Success",
            message: "Location deleted successfully",
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
exports.LocationController = {
    find,
    findById,
    createNewLocation,
    update,
    remove,
};
