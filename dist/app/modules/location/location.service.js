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
exports.LocationService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const find = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.location.findMany({});
    return result;
});
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.location.findUnique({
        where: {
            id: id,
        },
    });
    return result;
});
const createNewLocation = (data) => __awaiter(void 0, void 0, void 0, function* () {
    //@ For creating single location data =>
    const result = yield prisma_1.default.location.create({
        data: {
            uniqueIdentifier: data === null || data === void 0 ? void 0 : data.uniqueIdentifier,
            locationName: data === null || data === void 0 ? void 0 : data.locationName,
        },
    });
    //@ For creating bulk location data =>
    // const result = await prisma.location.createMany({
    //   data,
    // });
    return result;
});
const update = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.location.update({
        where: {
            id: id,
        },
        data: data,
    });
    return result;
});
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.location.delete({
        where: {
            id: id,
        },
    });
    return result;
});
exports.LocationService = {
    find,
    findById,
    createNewLocation,
    update,
    remove,
};
