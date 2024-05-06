import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import httpStatus from "http-status";

const prisma = new PrismaClient();

const registerUser = async (req: Request, res: Response): Promise<Response> => {
  const data = req.body;
  const {
    fullName,
    mobile,
    email,
    password,
    dateOfBirth,
    gender,
    age,
    role,
    occupation,
    address,
  } = data;

  if (
    !fullName ||
    fullName === undefined ||
    fullName === null ||
    fullName === ""
  ) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "FullName is required" });
  } else if (
    !mobile ||
    mobile === undefined ||
    mobile === null ||
    mobile === ""
  ) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Mobile number is required" });
  } else if (!email || email === undefined || email === null || email === "") {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Email is required" });
  } else if (
    !password ||
    password === undefined ||
    password === null ||
    password === ""
  ) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Password is required" });
  } else if (
    !dateOfBirth ||
    dateOfBirth === undefined ||
    dateOfBirth === null ||
    dateOfBirth === ""
  ) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Date Of Birth is required" });
  } else if (
    !dateOfBirth ||
    dateOfBirth === undefined ||
    dateOfBirth === null ||
    dateOfBirth === ""
  ) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Date Of Birth is required" });
  } else if (
    !gender ||
    gender === undefined ||
    gender === null ||
    gender === ""
  ) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Gender is required" });
  } else if (!age || age === undefined || age === null || age === "") {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Age is required" });
  } else if (!role || role === undefined || role === null || role === "") {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Role is required" });
  } else if (
    !occupation ||
    occupation === undefined ||
    occupation === null ||
    occupation === ""
  ) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Occupation is required" });
  } else if (
    !address ||
    address === undefined ||
    address === null ||
    address === ""
  ) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Address is required" });
  }

  try {
    const isUserExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (isUserExist) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Email already exist" });
    }

    const isMobileExist = await prisma.user.findUnique({
      where: {
        mobile: mobile,
      },
    });

    if (isMobileExist) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Mobile number already exist" });
    }

    const trimEmail = await email.split("@")[0];

    const result = await prisma.user.create({
      data: {
        fullName: fullName,
        mobile: mobile,
        email: email,
        password: password,
        dateOfBirth: dateOfBirth,
        gender: gender,
        age: age,
        occupation: occupation,
        role: role,
        userName: trimEmail,
        address: address,
      },
    });

    return res.status(httpStatus.OK).json({ result });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error });
  }
};

export const UserController = {
  registerUser,
};
