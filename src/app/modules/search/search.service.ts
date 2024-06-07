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
      const now = new Date();
      const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
      const twoMinutesFromNow = new Date(now.getTime() + 2 * 60 * 1000);

      // Poll for matching requests => The matched search request or undefined if no matching request is found.
      const pollForMatchingRequests = async (): Promise<
        SearchRequest | undefined
      > => {
        let searchResults: any;
        let searchResultsForTraveler: any;

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
                gte: twoMinutesAgo,
                lte: twoMinutesFromNow,
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
                gte: twoMinutesAgo,
                lte: twoMinutesFromNow,
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

          await prisma.searchRequest.update({
            where: { id: matchedResult.id },
            data: { matched: true },
          });

          return matchedResult;
        } else {
          // If no matching request is found, wait for 5 seconds and poll again
          await new Promise((resolve) => setTimeout(resolve, 5000));
          return pollForMatchingRequests();
        }
      };

      return pollForMatchingRequests();
    }
  } catch (error) {
    console.error("Failed to process search request:", error);
    throw error;
  }
};

export const SearchService = {
  search,
};
