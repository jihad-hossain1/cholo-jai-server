
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { validateDateOfBirth, validateField, validateMobile,validateGender,validateOccupation,validateUserType,validateAge } from "../../../helpers/inputFieldValidation";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const createUser = async (req: Request, res: Response)=> {
  const reqFromBody = req.body;
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
  } = reqFromBody;

  try {
  
  validateField(fullName, "Full Name", 1, 50);
  validateField(email, "Email", 1, 50);
  validateField(password, "Password", 6, 30);
  validateOccupation(occupation);
  validateUserType(role);
  validateField(address, "Address", 1, 250);
  validateDateOfBirth(dateOfBirth);
  validateMobile(mobile);
  validateGender(gender);
  validateAge(age);

  const userEmailExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
  });
    
    if (userEmailExist) {
      return res.status(400).json({ message: "Email already exist" });
    }

    const userMobileExist = await prisma.user.findFirst({
        where: {
            mobile: mobile
        }
    })

    if (userMobileExist) {
        return res.status(400).json({ message: "Mobile already exist" });
    }

    const trimEmail = await email.split("@")[0];

    const generatePassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        mobile: mobile,
        email: email,
        password: generatePassword,
        dateOfBirth: dateOfBirth,
        gender: gender,
        age: +age,
        occupation: occupation,
        role: role,
        userName: trimEmail,
        address: address.trim(),
      },
    });

    return res.status(201).json({ result: newUser });

  } catch (error) {
    console.log(error);
  if (error instanceof Error) {
    return res.status(400).json({ message: error.message });
  }
}


};

const loginUser = async (req: Request, res: Response) => {
  const reqFromBody = req.body;
  const { mobile, password } = reqFromBody;
  try {
    const user = await prisma.user.findFirst({
      where: {
        mobile: mobile,
      },
    })

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid password" });
    }

     const tokenData = {
      id: user.id,
      userName: user.userName,
      email: user.email,
    };

    // console.log("user from tokendata", tokenData);

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "10h",
    });

    let response = res.status(200).json({
      message: "login successfull",
      success: true,
    });

    response.cookie("token", token, {
      httpOnly: false,
    })

    // response.cookies.set("token", token, {
    //   httpOnly: false,
    // });
    return response
  } catch (error) {
    return
  }
}

export const UserController = {
  createUser,
  loginUser
};
