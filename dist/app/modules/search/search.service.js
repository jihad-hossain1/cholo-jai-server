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
exports.SearchService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const search = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the user by ID
        const findUser = yield prisma_1.default.user.findUnique({
            where: {
                id: data === null || data === void 0 ? void 0 : data.userId,
            },
        });
        if (!findUser) {
            return null;
        }
        // Create a new search request
        const createASearchReq = yield prisma_1.default.searchRequest.create({
            data: {
                fullName: findUser === null || findUser === void 0 ? void 0 : findUser.fullName,
                email: findUser === null || findUser === void 0 ? void 0 : findUser.email,
                gender: findUser.gender,
                role: findUser === null || findUser === void 0 ? void 0 : findUser.role,
                currentLocation: data === null || data === void 0 ? void 0 : data.currentLocation,
                destinationLocation: data === null || data === void 0 ? void 0 : data.destinationLocation,
                filterGenderType: data === null || data === void 0 ? void 0 : data.filterGenderType,
                filterVehicleCapacity: data === null || data === void 0 ? void 0 : data.filterVehicleCapacity,
                filterVehicleType: data === null || data === void 0 ? void 0 : data.filterVehicleType,
                matched: false,
                userId: data === null || data === void 0 ? void 0 : data.userId,
            },
        });
        if (createASearchReq) {
            const now = new Date();
            const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
            const twoMinutesFromNow = new Date(now.getTime() + 2 * 60 * 1000);
            // Poll for matching requests => The matched search request or undefined if no matching request is found.
            const pollForMatchingRequests = () => __awaiter(void 0, void 0, void 0, function* () {
                let searchResults;
                let searchResultsForTraveler;
                // Find matching requests based on the user's role
                if ((findUser === null || findUser === void 0 ? void 0 : findUser.role) === "sharer") {
                    searchResults = yield prisma_1.default.searchRequest.findMany({
                        where: {
                            role: "traveler",
                            currentLocation: data === null || data === void 0 ? void 0 : data.currentLocation,
                            destinationLocation: data === null || data === void 0 ? void 0 : data.destinationLocation,
                            filterVehicleType: data === null || data === void 0 ? void 0 : data.filterVehicleType,
                            filterGenderType: data === null || data === void 0 ? void 0 : data.filterGenderType,
                            createdAt: {
                                gte: twoMinutesAgo,
                                lte: twoMinutesFromNow,
                            },
                            matched: false,
                        },
                    });
                }
                else if ((findUser === null || findUser === void 0 ? void 0 : findUser.role) === "traveler") {
                    searchResults = yield prisma_1.default.searchRequest.findMany({
                        where: {
                            role: "sharer",
                            currentLocation: data === null || data === void 0 ? void 0 : data.currentLocation,
                            destinationLocation: data === null || data === void 0 ? void 0 : data.destinationLocation,
                            filterVehicleType: data === null || data === void 0 ? void 0 : data.filterVehicleType,
                            filterGenderType: data === null || data === void 0 ? void 0 : data.filterGenderType,
                            createdAt: {
                                gte: twoMinutesAgo,
                                lte: twoMinutesFromNow,
                            },
                            matched: false,
                        },
                    });
                }
                // Find matching requests for travelers
                if ((findUser === null || findUser === void 0 ? void 0 : findUser.role) === "traveler") {
                    searchResultsForTraveler = yield prisma_1.default.searchRequest.findMany({
                        where: {
                            AND: [
                                { role: "traveler" },
                                { userId: { not: data.userId } },
                                { currentLocation: data === null || data === void 0 ? void 0 : data.currentLocation },
                                { destinationLocation: data === null || data === void 0 ? void 0 : data.destinationLocation },
                                { filterVehicleType: data === null || data === void 0 ? void 0 : data.filterVehicleType },
                                { filterGenderType: data === null || data === void 0 ? void 0 : data.filterGenderType },
                                {
                                    createdAt: {
                                        gte: twoMinutesAgo,
                                        lte: twoMinutesFromNow,
                                    },
                                },
                                { matched: false },
                            ],
                        },
                    });
                }
                // If there are matching requests, update the matched status and return the matched request
                if (searchResults.length > 0 || searchResultsForTraveler.length > 0) {
                    const matchedResult = searchResults[0] || searchResultsForTraveler[0];
                    yield prisma_1.default.searchRequest.update({
                        where: { id: matchedResult.id },
                        data: { matched: true },
                    });
                    return matchedResult;
                }
                else {
                    // If no matching request is found, wait for 5 seconds and poll again
                    yield new Promise((resolve) => setTimeout(resolve, 5000));
                    return pollForMatchingRequests();
                }
            });
            return pollForMatchingRequests();
        }
    }
    catch (error) {
        console.error("Failed to process search request:", error);
        throw error;
    }
});
exports.SearchService = {
    search,
};
