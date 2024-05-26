import { SearchRequest } from "@prisma/client";
import prisma from "../../../shared/prisma";

const search = async (data: {
  currentLocation: string;
  destinationLocation: string;
  userId: string;
}) => {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        id: data?.userId,
      },
    });

    //# Check If User Exists =>
    if (!findUser) {
      return null;
    }

    const createASearchReq = await prisma.searchRequest.create({
      data: {
        email: findUser?.email,
        role: findUser?.role,
        currentLocation: data?.currentLocation,
        destinationLocation: data?.destinationLocation,
        matched: false,
        userId: data?.userId,
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

        if (findUser?.role === "sharer") {
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
        } else if (findUser?.role === "traveler") {
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
//     console.log("🚀 ~ currentLocationCheck:", currentLocationCheck);

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
