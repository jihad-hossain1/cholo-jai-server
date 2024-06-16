import { SearchRequest } from "@prisma/client";
import prisma from "../../../shared/prisma";

const search = async (data: {
  currentLocation: string;
  destinationLocation: string;
  filterVehicleType: string;
  filterGenderType: string;
  filterVehicleCapacity: string;
  userId: string;
}) => {
  try {
    // Find the user by ID
    const findUser = await prisma.user.findUnique({
      where: {
        id: data?.userId,
      },
    });

    if (!findUser) {
      return null;
    }

    // Create a new search request
    const createASearchReq = await prisma.searchRequest.create({
      data: {
        fullName: findUser?.fullName,
        email: findUser?.email,
        gender: findUser.gender,
        role: findUser?.role,
        currentLocation: data?.currentLocation,
        destinationLocation: data?.destinationLocation,
        filterGenderType: data?.filterGenderType,
        filterVehicleCapacity: data?.filterVehicleCapacity,
        filterVehicleType: data?.filterVehicleType,
        matched: false,
        userId: data?.userId,
      },
    });

    if (createASearchReq) {
      const startTime = Date.now();
      const pollDuration = 30 * 1000; // 30 seconds

      // Poll for matching requests => The matched search request or undefined if no matching request is found.
      const pollForMatchingRequests = async (): Promise<
        SearchRequest | undefined
      > => {
        const elapsedTime = Date.now() - startTime;

        if (elapsedTime >= pollDuration) {
          throw new Error("No matching request found within 30 seconds.");
        }

        let searchResults: any = [];
        let searchResultsForTraveler: any = [];

        // Find matching requests based on the user's role
        if (findUser?.role === "sharer") {
          searchResults = await prisma.searchRequest.findMany({
            where: {
              role: "traveler",
              currentLocation: data?.currentLocation,
              destinationLocation: data?.destinationLocation,
              filterVehicleType: data?.filterVehicleType,
              filterGenderType: data?.filterGenderType,
              createdAt: {
                gte: new Date(startTime - 2 * 60 * 1000), // 2 minutes ago
                lte: new Date(startTime + pollDuration), // 30 seconds from now
              },
              matched: false,
            },
          });
        } else if (findUser?.role === "traveler") {
          searchResults = await prisma.searchRequest.findMany({
            where: {
              role: "sharer",
              currentLocation: data?.currentLocation,
              destinationLocation: data?.destinationLocation,
              filterVehicleType: data?.filterVehicleType,
              filterGenderType: data?.filterGenderType,
              createdAt: {
                gte: new Date(startTime - 2 * 60 * 1000), // 2 minutes ago
                lte: new Date(startTime + pollDuration), // 30 seconds from now
              },
              matched: false,
            },
          });
        }

        // Find matching requests for travelers
        if (findUser?.role === "traveler") {
          searchResultsForTraveler = await prisma.searchRequest.findMany({
            where: {
              AND: [
                { role: "traveler" },
                { userId: { not: data.userId } },
                { currentLocation: data?.currentLocation },
                { destinationLocation: data?.destinationLocation },
                { filterVehicleType: data?.filterVehicleType },
                { filterGenderType: data?.filterGenderType },
                {
                  createdAt: {
                    gte: new Date(startTime - 2 * 60 * 1000), // 2 minutes ago
                    lte: new Date(startTime + pollDuration), // 30 seconds from now
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

          await prisma.searchRequest.update({
            where: { id: matchedResult.id },
            data: { matched: true },
          });

          return matchedResult;
        } else {
          // If no matching request is found, wait for 5 seconds and poll again
          await new Promise((resolve) => setTimeout(resolve, 4000));
          return pollForMatchingRequests();
        }
      };

      return await pollForMatchingRequests();
    }
  } catch (error) {
    console.error("Failed to process search request:", error);
    throw error;
  }
};

export const SearchService = {
  search,
};
