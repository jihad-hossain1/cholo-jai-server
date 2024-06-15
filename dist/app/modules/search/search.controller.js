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
exports.SearchController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const search_service_1 = require("./search.service");
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield req.body;
        const result = yield search_service_1.SearchService.search(data);
        if (!result) {
            return res.status(http_status_1.default.NOT_FOUND).json({
                status: "Failed",
                message: "User information not found",
            });
        }
        return res.status(http_status_1.default.OK).json({
            status: "Success",
            message: "Search user find successfully",
            result: result,
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: "Something went wrong while searching a user",
            error: error || "Internal server error",
        });
    }
});
exports.SearchController = {
    search,
};
