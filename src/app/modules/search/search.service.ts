import prisma from "../../../shared/prisma";

// const search = async (data: {
//   username: string;
//   contactNumber: string;
//   role: any;
//   currentLocation: string;
//   destinationLocation: string;
//   time: string;
//   user: any;
// }) => {
//   try {
//     const createASearchReq = await prisma.searchRequest.create({
//       data: {
//         username: data?.username,
//         contactNumber: data?.contactNumber,
//         role: data?.role,
//         currentLocation: data?.currentLocation,
//         destinationLocation: data?.destinationLocation,
//         time: data?.time,
//       },
//     });

//     if (createASearchReq && data?.role === "sharer") {
//       const search = await prisma.searchRequest.findMany({
//         where: {
//           role: "traveler",
//           currentLocation: data?.currentLocation,
//           time: { gte: data?.time },
//         },
//       });

//       return search;
//     } else if (createASearchReq && data?.role === "traveler") {
//       const search = await prisma.searchRequest.findMany({
//         where: {
//           role: "sharer",
//           currentLocation: data?.currentLocation,
//         },
//       });

//       return search;
//     }
//   } catch (error) {
//     console.error("Failed to create search request:", error);
//   }
// };

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
      },
    });

    if (createASearchReq) {
      const now = new Date();
      const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
      const twoMinutesFromNow = new Date(now.getTime() + 2 * 60 * 1000);
      let searchQuery;
      if (data?.role === "sharer") {
        searchQuery = await prisma.searchRequest.findMany({
          where: {
            role: "traveler",
            currentLocation: data?.currentLocation,
            createdAt: {
              gte: twoMinutesAgo,
              lte: twoMinutesFromNow,
            },
          },
        });
      } else if (data?.role === "traveler") {
        searchQuery = await prisma.searchRequest.findMany({
          where: {
            role: "sharer",
            currentLocation: data?.currentLocation,
            createdAt: {
              gte: twoMinutesAgo,
              lte: twoMinutesFromNow,
            },
          },
        });
      }

      return searchQuery;
    }
  } catch (error) {
    console.error("Failed to create search request:", error);
  }
};

export const SearchService = {
  search,
};
