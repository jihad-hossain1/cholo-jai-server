import prisma from "../../../shared/prisma";
import { IUser } from "./user.interface";

const find = async () => {
  const result = await prisma.user.findMany();
  return result;
};

const findById = async (id: any) => {
  const result = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return result;
};

const findByMobile = async (mobile: string) => {
  const result = await prisma.user.findUnique({
    where: {
      mobile: mobile,
    },
  });
  return result;
};
const update = async (id: string, data: any) => {
  const result = await prisma.user.update({
    where: {
      id: id,
    },
    data: data,
  });
  return result;
};

const remove = async (id: string) => {
  const result = await prisma.user.delete({
    where: {
      id: id,
    },
  });
  return result;
};

export const UserService = {
  find,
  findById,
  update,
  remove,
  findByMobile,
};
