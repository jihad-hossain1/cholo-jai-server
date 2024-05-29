import config from "../../../config";
import prisma from "../../../shared/prisma";
import { IUser } from "./auth.interface";
import bcrypt from "bcrypt";

const register = async (data: IUser | any) => {
  const hashedPassword = await bcrypt.hash(data?.password, 10);
  const trimEmail = data?.email.split("@")[0];
  const result = await prisma.user.create({
    data: {
      userName: trimEmail,
      fullName: data?.fullName,
      mobile: data?.mobile,
      email: data?.email,
      password: hashedPassword,
      dateOfBirth: data?.dateOfBirth,
      gender: data?.gender,
      age: data?.age,
      occupation: data?.occupation,
      role: data?.role,
      address: data?.address,
    },
  });

  return result;
};
const login = async (data: IUser | any) => {
  const result = await prisma.user.findUnique({
    where: {
      email: data?.email,
      mobile: data?.mobile,
    },
  });

  return result;
};

export const AuthService = {
  register,
  login,
};
