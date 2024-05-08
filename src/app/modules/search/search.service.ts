import { SearchRequest } from "@prisma/client";
import prisma from "../../../shared/prisma";

const search = async (data: {
  username: string;
  contactNumber: string;
  role: any;
  currentLocation: string;
  destinationLocation: string;
  time: string;
  user: any;
}) => {
  try {
    const createASearchReq = await prisma.searchRequest.create({
      data: {
        username: data?.username,
        contactNumber: data?.contactNumber,
        role: data?.role,
        currentLocation: data?.currentLocation,
        destinationLocation: data?.destinationLocation,
        time: data?.time,
        matched: false,
      },
    });

    if (createASearchReq) {
      const now = new Date();
      const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
      const twoMinutesFromNow = new Date(now.getTime() + 2 * 60 * 1000);

      const pollForMatchingRequests = async (): Promise<
        SearchRequest | undefined
      > => {
        let searchResults: any = [];

        if (data?.role === "sharer") {
          searchResults = await prisma.searchRequest.findMany({
            where: {
              role: "traveler",
              currentLocation: data?.currentLocation,
              createdAt: {
                gte: twoMinutesAgo,
                lte: twoMinutesFromNow,
              },
              matched: false,
            },
          });
        } else if (data?.role === "traveler") {
          searchResults = await prisma.searchRequest.findMany({
            where: {
              role: "sharer",
              currentLocation: data?.currentLocation,
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

          await prisma.searchRequest.update({
            where: { id: matchedResult.id },
            data: { matched: true },
          });

          return matchedResult;
        } else {
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
