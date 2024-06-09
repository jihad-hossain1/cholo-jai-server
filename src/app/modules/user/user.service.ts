import prisma from "../../../shared/prisma";
import { IUser } from "./user.interface";

const find = async (page = 1, limit = 10, search = "") => {
  const skip = (page - 1) * limit;
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search, mode: "insensitive" } },
      ],
    },
    skip: skip,
    take: limit,
    select: {
      id: true,
      fullName: true,
      email: true,
      mobile: true,
      gender: true,
      age: true,
      occupation: true,
      role: true,
    },
  });

  const totalCount = await prisma.user.count({
    where: {
      OR: [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search, mode: "insensitive" } },
      ],
    },
  });

  return { users, totalCount };
};
// const find = async () => {
//   const result = await prisma.user.findMany({
//     select: {
//       id: true,
//       fullName: true,
//       email: true,
//       mobile: true,
//       gender: true,
//       age: true,
//       occupation: true,
//       role: true,
//     },
//   });
//   return result;
// };

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
