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
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../../config"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield req.body;
        const requiredFields = [
            "fullName",
            "email",
            "password",
            "mobile",
            "gender",
            "role",
            "age",
            "dateOfBirth",
            "address",
            "occupation",
        ];
        for (const field of requiredFields) {
            if (!data[field] || data[field] == "") {
                return res.status(http_status_1.default.BAD_REQUEST).json({
                    error: `${field} is required`,
                    status: "Failed",
                });
            }
        }
        if ((data === null || data === void 0 ? void 0 : data.role) == "sharer") {
            const areAgesValid = (data === null || data === void 0 ? void 0 : data.age) >= 18 && (data === null || data === void 0 ? void 0 : data.age) <= 60;
            if (!areAgesValid) {
                return res
                    .status(http_status_1.default.BAD_REQUEST)
                    .json({ error: "Age must be between 18 and 60", status: "Failed" });
            }
        }
        // const isAgeDateOfBirthSame =
        //   new Date(data?.dateOfBirth).getFullYear() == data?.age;
        // if (!isAgeDateOfBirthSame) {
        //   return res
        //     .status(httpStatus.BAD_REQUEST)
        //     .json({ error: "Age must be same as date of birth", status: "Failed" });
        // }
        const isUserExist = yield prisma_1.default.user.findUnique({
            where: {
                email: data === null || data === void 0 ? void 0 : data.email,
            },
        });
        if (isUserExist) {
            return res
                .status(http_status_1.default.BAD_REQUEST)
                .json({ error: "User already exists", status: "Failed" });
        }
        const isMobileExist = yield prisma_1.default.user.findUnique({
            where: {
                mobile: data === null || data === void 0 ? void 0 : data.mobile,
            },
        });
        if (isMobileExist) {
            return res
                .status(http_status_1.default.BAD_REQUEST)
                .json({ error: "Mobile number already exist", status: "Failed" });
        }
        const result = yield auth_service_1.AuthService.register(data);
        return res.status(http_status_1.default.OK).json({
            status: "Success",
            message: "User register successfully",
            result: result,
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            error: "Something went wrong while register",
            errors: error || "Internal server error",
        });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield req.body;
        const userInfo = yield auth_service_1.AuthService.login(data);
        const token = jsonwebtoken_1.default.sign({
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            data: {
                userId: userInfo === null || userInfo === void 0 ? void 0 : userInfo.id,
                email: userInfo === null || userInfo === void 0 ? void 0 : userInfo.email,
                role: userInfo === null || userInfo === void 0 ? void 0 : userInfo.role,
            },
        }, config_1.default.jwt.secret);
        res.cookie("credential", token, { httpOnly: true, secure: false });
        return res.status(http_status_1.default.OK).json({
            status: "Success",
            message: "User login successfully",
            credential: token,
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: "Something went wrong while login",
            error: error || "Internal server error",
        });
    }
});
exports.AuthController = {
    register,
    login,
};
