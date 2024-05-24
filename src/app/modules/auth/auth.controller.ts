import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import { IUser } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../../config";

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
      if (!data[field] || data[field] == "") {
        return res.status(httpStatus.BAD_REQUEST).json({
          error: `${field} is required`,
          status: "Failed",
        });
      }
    }

    if (data?.role == "sharer") {
      const areAgesValid = data?.age >= 18 && data?.age <= 60;
      if (!areAgesValid) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ error: "Age must be between 18 and 60", status: "Failed" });
      }
    }

    // const isAgeDateOfBirthSame =
    //   new Date(data?.dateOfBirth).getFullYear() == data?.age;
    // if (!isAgeDateOfBirthSame) {
    //   return res
    //     .status(httpStatus.BAD_REQUEST)
    //     .json({ error: "Age must be same as date of birth", status: "Failed" });
    // }

    const isUserExist = await prisma.user.findUnique({
      where: {
        email: data?.email,
      },
    });
    if (isUserExist) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: "User already exists", status: "Failed" });
    }

    const isMobileExist = await prisma.user.findUnique({
      where: {
        mobile: data?.mobile,
      },
    });

    if (isMobileExist) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: "Mobile number already exist", status: "Failed" });
    }

    const result = await AuthService.register(data);

    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "User register successfully",
      result: result,
    });
  } catch (error: any) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      error: "Something went wrong while register",
      errors: error || "Internal server error",
    });
  }
};

const login = async (
  req: Request,
  res: Response
): Promise<Partial<IUser | any>> => {
  try {
    const data = await req.body;
    const userInfo = await AuthService.login(data);

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: {
          userId: userInfo?.id,
          email: userInfo?.email,
          role: userInfo?.role,
        },
      },
      config.jwt.secret as string
    );

    res.cookie("credential", token, { httpOnly: true, secure: false });

    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "User login successfully",
      credential: token,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Something went wrong while login",
      error: error || "Internal server error",
    });
  }
};

export const AuthController = {
  register,
  login,
};
