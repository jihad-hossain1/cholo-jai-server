import { Request, Response } from "express";
import { AuthService } from "./user.service";
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import { IUser } from "./user.interface";

const register = async (
  req: Request,
  res: Response
): Promise<Partial<IUser | any>> => {
  try {
    const data = await req.body;

    const requiredFields = [
      "fullName",
      "email",
      "password",
      "mobile",
      "gender",
      "role",
      "age",
      "dateOfBirth",
      "address",
      "occupation",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: `${field} is required` });
      }
    }

    const isUserExist = await prisma.user.findUnique({
      where: {
        email: data?.email,
      },
    });
    if (isUserExist) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "User already exists" });
    }

    const isMobileExist = await prisma.user.findUnique({
      where: {
        mobile: data?.mobile,
      },
    });

    if (isMobileExist) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Mobile number already exist" });
    }

    const result = await AuthService.register(data);

    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "User register successfully",
      result: result,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error || "Internal server error" });
  }
};
const login = async (
  req: Request,
  res: Response
): Promise<Partial<IUser | any>> => {
  try {
    const data = await req.body;

    const result = await AuthService.login(data);

    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "User login successfully",
      result: result,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error || "Internal server error" });
  }
};

export const AuthController = {
  register,
  login,
};
