import { SearchRequest } from "@prisma/client";
import prisma from "../../../shared/prisma";

// const search = async (data: {
//   currentLocation: string;
//   destinationLocation: string;
//   filterVehicleType: string;
//   filterGenderType: string;
//   filterVehicleCapacity: string;
//   userId: string;
// }) => {
//   try {
//     // Find the user by ID
//     const findUser = await prisma.user.findUnique({
//       where: {
//         id: data?.userId,
//       },
//     });

//     if (!findUser) {
//       return null;
//     }

//     // Create a new search request
//     const createASearchReq = await prisma.searchRequest.create({
//       data: {
//         fullName: findUser?.fullName,
//         email: findUser?.email,
//         gender: findUser.gender,
//         role: findUser?.role,
//         currentLocation: data?.currentLocation,
//         destinationLocation: data?.destinationLocation,
//         filterGenderType: data?.filterGenderType,
//         filterVehicleCapacity: data?.filterVehicleCapacity,
//         filterVehicleType: data?.filterVehicleType,
//         matched: false,
//         userId: data?.userId,
//       },
//     });

//     if (createASearchReq) {
//       const startTime = Date.now();
//       const pollDuration = 30 * 1000; // 30 seconds

//       // Poll for matching requests => The matched search request or undefined if no matching request is found.
//       const pollForMatchingRequests = async (): Promise<
//         SearchRequest | undefined
//       > => {
//         const elapsedTime = Date.now() - startTime;

//         if (elapsedTime >= pollDuration) {
//           throw new Error("No matching request found within 30 seconds.");
//         }

//         let searchResults: any = [];
//         let searchResultsForTraveler: any = [];

//         // Find matching requests based on the user's role
//         if (findUser?.role === "sharer") {
//           searchResults = await prisma.searchRequest.findMany({
//             where: {
//               role: "traveler",
//               currentLocation: data?.currentLocation,
//               destinationLocation: data?.destinationLocation,
//               filterVehicleType: data?.filterVehicleType,
//               filterGenderType: data?.filterGenderType,
//               createdAt: {
//                 gte: new Date(startTime - 2 * 60 * 1000), // 2 minutes ago
//                 lte: new Date(startTime + pollDuration), // 30 seconds from now
//               },
//               matched: false,
//             },
//           });
//         } else if (findUser?.role === "traveler") {
//           searchResults = await prisma.searchRequest.findMany({
//             where: {
//               role: "sharer",
//               currentLocation: data?.currentLocation,
//               destinationLocation: data?.destinationLocation,
//               filterVehicleType: data?.filterVehicleType,
//               filterGenderType: data?.filterGenderType,
//               createdAt: {
//                 gte: new Date(startTime - 2 * 60 * 1000), // 2 minutes ago
//                 lte: new Date(startTime + pollDuration), // 30 seconds from now
//               },
//               matched: false,
//             },
//           });
//         }

//         // Find matching requests for travelers
//         if (findUser?.role === "traveler") {
//           searchResultsForTraveler = await prisma.searchRequest.findMany({
//             where: {
//               AND: [
//                 { role: "traveler" },
//                 { userId: { not: data.userId } },
//                 { currentLocation: data?.currentLocation },
//                 { destinationLocation: data?.destinationLocation },
//                 { filterVehicleType: data?.filterVehicleType },
//                 { filterGenderType: data?.filterGenderType },
//                 {
//                   createdAt: {
//                     gte: new Date(startTime - 2 * 60 * 1000), // 2 minutes ago
//                     lte: new Date(startTime + pollDuration), // 30 seconds from now
//                   },
//                 },
//                 { matched: false },
//               ],
//             },
//           });
//         }

//         // If there are matching requests, update the matched status and return the matched request
//         if (searchResults.length > 0 || searchResultsForTraveler.length > 0) {
//           const matchedResult = searchResults[0] || searchResultsForTraveler[0];

//           await prisma.searchRequest.update({
//             where: { id: matchedResult.id },
//             data: { matched: true },
//           });

//           return matchedResult;
//         } else {
//           // If no matching request is found, wait for 5 seconds and poll again
//           await new Promise((resolve) => setTimeout(resolve, 4000));
//           return pollForMatchingRequests();
//         }
//       };

//       return await pollForMatchingRequests();
//     }
//   } catch (error) {
//     console.error("Failed to process search request:", error);
//     throw error;
//   }
// };

const search = async (data: {
  currentLocation: string;
  destinationLocation: string;
  filterVehicleType: string;
  filterGenderType: string;
  filterVehicleCapacity: string;
  userId: string;
}) => {
  console.log(data?.currentLocation, data?.destinationLocation);
  try {
    // Find the user by ID
    const findUser = await prisma.user.findUnique({
      where: { id: data?.userId },
    });

    if (!findUser) return null;

    // Find user's current location based on location level
    const findCurrentLocation = await prisma.location.findFirst({
      where: { uniqueIdentifier: data?.currentLocation },
    });

    // Find user's destination location based on location level
    const findDestinationLocation = await prisma.location.findFirst({
      where: { uniqueIdentifier: data?.destinationLocation },
    });

    if (!findCurrentLocation || !findDestinationLocation) {
      throw new Error("Locations not found");
    }

    // Create a new search request
    const createASearchReq = await prisma.searchRequest.create({
      data: {
        fullName: findUser?.fullName,
        email: findUser?.email,
        gender: findUser.gender,
        role: findUser?.role,
        currentLocation: findCurrentLocation?.locationName as string,
        destinationLocation: findDestinationLocation?.locationName as string,
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

        // Retrieve connected locations for current and destination locations
        const connectedCurrentLocations =
          await prisma.connectedLocation.findMany({
            where: {
              OR: [
                { fromLocationId: findCurrentLocation.id },
                { toLocationId: findCurrentLocation.id },
              ],
            },
            include: {
              fromLocation: true,
              toLocation: true,
            },
          });

        const connectedDestinationLocations =
          await prisma.connectedLocation.findMany({
            where: {
              OR: [
                { fromLocationId: findDestinationLocation.id },
                { toLocationId: findDestinationLocation.id },
              ],
            },
            include: {
              fromLocation: true,
              toLocation: true,
            },
          });

        // Create a list of all possible connected locations (like a "road" network)
        const currentLocations = connectedCurrentLocations.map(
          (loc) => loc.toLocationId
        ); // or fromLocationId based on your use case
        const destinationLocations = connectedDestinationLocations.map(
          (loc) => loc.fromLocationId
        ); // or toLocationId

        // Find matching requests for sharer and traveler roles
        let searchResults = await prisma.searchRequest.findMany({
          where: {
            role: findUser?.role === "sharer" ? "traveler" : "sharer",
            currentLocation: { in: currentLocations }, // Use connected locations
            destinationLocation: { in: destinationLocations }, // Use connected destinations
            filterVehicleType: data?.filterVehicleType,
            filterGenderType: data?.filterGenderType,
            createdAt: {
              gte: new Date(startTime - 2 * 60 * 1000), // 2 minutes ago
              lte: new Date(startTime + pollDuration), // 30 seconds from now
            },
            matched: false,
          },
        });

        // Check for overlap between users' start and end locations
        searchResults = searchResults.filter((result) => {
          const resultStart = result.currentLocation;
          const resultEnd = result.destinationLocation;

          const userStart = findCurrentLocation.locationName;
          const userEnd = findDestinationLocation.locationName;

          // Check if their paths overlap
          return (
            currentLocations.includes(resultStart) &&
            destinationLocations.includes(resultEnd)
          );
        });

        if (searchResults.length > 0) {
          const matchedResult = searchResults[0];
          await prisma.searchRequest.update({
            where: { id: matchedResult.id },
            data: { matched: true },
          });
          return matchedResult;
        }

        // Wait and poll again
        await new Promise((resolve) => setTimeout(resolve, 4000));
        return pollForMatchingRequests();
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
