
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { validateDateOfBirth, validateField, validateMobile,validateGender,validateOccupation,validateUserType } from "../../../helpers/inputFieldValidation";
import bcrypt from 'bcrypt';

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
    console.log(generatePassword);

    const newUser = await prisma.user.create({
      data: {
        fullName: fullName,
        mobile: mobile,
        email: email,
        password: generatePassword,
        dateOfBirth: dateOfBirth,
        gender: gender,
        age: age,
        occupation: occupation,
        role: role,
        userName: trimEmail,
        address: address,
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

export const UserController = {
  createUser,
};
