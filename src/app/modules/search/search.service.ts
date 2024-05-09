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
          const response = await prisma.searchRequest.findMany({
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

          if (!response) {
            throw new Error("No result found");
          }
          searchResults = response;
        } else if (data?.role === "traveler") {
          const _response = await prisma.searchRequest.findMany({
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

          if (!_response) {
            throw new Error("No result found");
          }
          searchResults = _response;
        }

        if (searchResults.length > 0) {
          const matchedResult = searchResults[0];

          const _result = await prisma.searchRequest.update({
            where: { id: matchedResult.id },
            data: { matched: true },
          });

          if (!_result) {
            throw new Error("No result updated");
          }

          return matchedResult;
        } else {
          const resolved = await new Promise((resolve) =>
            setTimeout(resolve, 5000)
          );

          if (!resolved) {
            throw new Error("Not able to Search");
          }

          return pollForMatchingRequests();
        }
      };

      if (!pollForMatchingRequests) {
        throw new Error("Something went wrong, when searching");
      }
      return pollForMatchingRequests();
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.error("Failed to process search request:", error);
  }
};

export const SearchService = {
  search,
};
