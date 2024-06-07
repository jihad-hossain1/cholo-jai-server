import httpStatus from "http-status";
import prisma from "../../../shared/prisma";

const find = async () => {
  const result = await prisma.location.findMany({});
  return result;
};

const findById = async (id: any) => {
  const result = await prisma.location.findUnique({
    where: {
      id: id,
    },
  });
  return result;
};

const createNewLocation = async (data: any) => {
  //@ For creating single location data =>
  const result = await prisma.location.create({
    data: {
      uniqueIdentifier: data?.uniqueIdentifier,
      locationName: data?.locationName,
    },
  });

  //@ For creating bulk location data =>
  // const result = await prisma.location.createMany({
  //   data,
  // });

  return result;
};

const update = async (id: string, data: any) => {
  const result = await prisma.location.update({
    where: {
      id: id,
    },
    data: data,
  });
  return result;
};

const remove = async (id: string) => {
  const result = await prisma.location.delete({
    where: {
      id: id,
    },
  });
  return result;
};

export const LocationService = {
  find,
  findById,
  createNewLocation,
  update,
  remove,
};
