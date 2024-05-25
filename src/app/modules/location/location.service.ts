import httpStatus from "http-status";
import prisma from "../../../shared/prisma";

const createNewLocation = async (data: any) => {
  //@ For creating single location data =>
  // const result = await prisma.location.create({
  //   data: {
  //     uniqueIdentifier: data?.uniqueIdentifier,
  //     locationName: data?.locationName,
  //   },
  // });

  //@ For creating bulk location data =>
  const result = await prisma.location.createMany({
    data,
  });

  return result;
};

export const LocationService = {
  createNewLocation,
};
