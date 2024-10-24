import httpStatus from "http-status";
import prisma from "../../../shared/prisma";

const find = async () => {
  const result = await prisma.connectedLocation.findMany({});
  return result;
};

const findById = async (id: any) => {
  const result = await prisma.connectedLocation.findUnique({
    where: {
      id: id,
    },
  });
  return result;
};

const createNewConnectedLocation = async (data: any) => {
  //@ For creating single location data =>
  console.log(data);
  const result = await prisma.connectedLocation.create({
    data: {
      fromLocationId: data?.fromLocationId,
      toLocationId: data?.toLocationId,
      distance: data?.distance || null,
    },
  });
  console.log(result);
  //@ For creating bulk location data =>
  // const result = await prisma.location.createMany({
  //   data,
  // });

  return result;
};

const update = async (id: string, data: any) => {
  const result = await prisma.connectedLocation.update({
    where: {
      id: id,
    },
    data: data,
  });
  return result;
};

const remove = async (id: string) => {
  const result = await prisma.connectedLocation.delete({
    where: {
      id: id,
    },
  });
  return result;
};

export const ConnectedLocationService = {
  find,
  findById,
  createNewConnectedLocation,
  update,
  remove,
};
