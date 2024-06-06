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
        console.log(data);
        const findUser = yield prisma_1.default.user.findUnique({
            where: {
                id: data === null || data === void 0 ? void 0 : data.userId,
            },
        });
        //# Check If User Exists =>
        if (!findUser) {
            return null;
        }
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
            const pollForMatchingRequests = () => __awaiter(void 0, void 0, void 0, function* () {
                let searchResults = [];
                if ((findUser === null || findUser === void 0 ? void 0 : findUser.role) === "sharer") {
                    searchResults = yield prisma_1.default.searchRequest.findMany({
                        where: {
                            role: "traveler",
                            currentLocation: data === null || data === void 0 ? void 0 : data.currentLocation,
                            destinationLocation: data === null || data === void 0 ? void 0 : data.destinationLocation,
                            filterVehicleType: data === null || data === void 0 ? void 0 : data.filterVehicleType,
                            filterVehicleCapacity: data === null || data === void 0 ? void 0 : data.filterVehicleCapacity,
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
                            filterVehicleCapacity: data === null || data === void 0 ? void 0 : data.filterVehicleCapacity,
                            filterGenderType: data === null || data === void 0 ? void 0 : data.filterGenderType,
                            createdAt: {
                                gte: twoMinutesAgo,
                                lte: twoMinutesFromNow,
                            },
                            matched: false,
                        },
                    });
                }
                if (searchResults.length > 0) {
                    const matchedResult = searchResults[0];
                    yield prisma_1.default.searchRequest.update({
                        where: { id: matchedResult.id },
                        data: { matched: true },
                    });
                    return matchedResult;
                }
                else {
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
// import { SearchRequest } from "@prisma/client";
// import prisma from "../../../shared/prisma";
// const search = async (data: {
//   currentLocation: string;
//   destinationLocation: string;
//   userId: string;
// }) => {
//   try {
//     const findUser = await prisma.user.findUnique({
//       where: { id: data?.userId },
//     });
//     if (!findUser) return null;
//     const currentLocationCheck = await prisma.location.findFirst({
//       where: { uniqueIdentifier: data?.currentLocation },
//     });
//     if (!currentLocationCheck) return null;
//     const destinationLocationCheck = await prisma.location.findFirst({
//       where: { uniqueIdentifier: data?.destinationLocation },
//     });
//     if (!destinationLocationCheck) return null;
//     const createASearchReq = await prisma.searchRequest.create({
//       data: {
//         email: findUser?.email,
//         role: findUser?.role,
//         currentLocation: currentLocationCheck?.locationName,
//         destinationLocation: destinationLocationCheck?.locationName,
//         matched: false,
//         userId: data?.userId,
//       },
//     });
//     if (createASearchReq) {
//       const now = new Date();
//       const twoMinutesAgo = new Date(now.getTime() - 1 * 60 * 1000);
//       const twoMinutesFromNow = new Date(now.getTime() + 1 * 60 * 1000);
//       const getIdNumber = (uniqueIdentifier: string) => {
//         const parts = uniqueIdentifier.split(".");
//         return parseFloat(parts[1]);
//       };
//       const currentIdNumber = getIdNumber(
//         currentLocationCheck.uniqueIdentifier
//       );
//       const lowerBound = (currentIdNumber - 0.2).toFixed(1);
//       const upperBound = (currentIdNumber + 0.2).toFixed(1);
//       const generateRange = (lower: string, upper: string) => {
//         const range = [];
//         const lowerNum = parseFloat(lower);
//         const upperNum = parseFloat(upper);
//         for (let i = lowerNum; i <= upperNum; i += 0.1) {
//           range.push(`1.${i.toFixed(1)}`);
//         }
//         return range;
//       };
//       const matchingRange = generateRange(lowerBound, upperBound);
//       const pollForMatchingRequests = async (): Promise<
//         SearchRequest | undefined
//       > => {
//         let searchResults: any = [];
//         if (findUser?.role === "sharer") {
//           searchResults = await prisma.searchRequest.findMany({
//             where: {
//               role: "traveler",
//               currentLocation: {
//                 in: matchingRange,
//               },
//               createdAt: {
//                 gte: twoMinutesAgo,
//                 lte: twoMinutesFromNow,
//               },
//               matched: false,
//             },
//           });
//         } else if (findUser?.role === "traveler") {
//           searchResults = await prisma.searchRequest.findMany({
//             where: {
//               role: "sharer",
//               currentLocation: {
//                 in: matchingRange,
//               },
//               createdAt: {
//                 gte: twoMinutesAgo,
//                 lte: twoMinutesFromNow,
//               },
//               matched: false,
//             },
//           });
//         }
//         if (searchResults.length > 0) {
//           const matchedResult = searchResults[0];
//           await prisma.searchRequest.update({
//             where: { id: matchedResult.id },
//             data: { matched: true },
//           });
//           return matchedResult;
//         } else {
//           await new Promise((resolve) => setTimeout(resolve, 5000));
//           return pollForMatchingRequests();
//         }
//       };
//       return pollForMatchingRequests();
//     }
//   } catch (error) {
//     console.error("Failed to process search request:", error);
//     throw error;
//   }
// };
// export const SearchService = {
//   search,
// };
