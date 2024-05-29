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
exports.AuthService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const register = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(data === null || data === void 0 ? void 0 : data.password, 10);
    const trimEmail = data === null || data === void 0 ? void 0 : data.email.split("@")[0];
    const result = yield prisma_1.default.user.create({
        data: {
            userName: trimEmail,
            fullName: data === null || data === void 0 ? void 0 : data.fullName,
            mobile: data === null || data === void 0 ? void 0 : data.mobile,
            email: data === null || data === void 0 ? void 0 : data.email,
            password: hashedPassword,
            dateOfBirth: data === null || data === void 0 ? void 0 : data.dateOfBirth,
            gender: data === null || data === void 0 ? void 0 : data.gender,
            age: data === null || data === void 0 ? void 0 : data.age,
            occupation: data === null || data === void 0 ? void 0 : data.occupation,
            role: data === null || data === void 0 ? void 0 : data.role,
            address: data === null || data === void 0 ? void 0 : data.address,
        },
    });
    return result;
});
const login = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            email: data === null || data === void 0 ? void 0 : data.email,
            mobile: data === null || data === void 0 ? void 0 : data.mobile,
        },
    });
    return result;
});
exports.AuthService = {
    register,
    login,
};
