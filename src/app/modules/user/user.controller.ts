import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


const createUser = async(req: Request, res: Response): Promise<Response> => {
  const reqFromBody = req.body
  const { fullName, mobile, email, password, dateOfBirth, gender, age, role, occupation, address } = reqFromBody;
  
  // if (!fullName || fullName === undefined || fullName === null || fullName === '') {
  //   return res.status(400).json({ message: 'fullName is required' });
  // } else if (!mobile || mobile === undefined || mobile === null || mobile === '') {
  //   return res.status(400).json({ message: 'mobile is required' });
  // } else if (!email || email === undefined || email === null || email === '') {
  //   return res.status(400).json({ message: 'email is required' });
  // } else if (!password || password === undefined || password === null || password === '') {
  //   return res.status(400).json({ message: 'password is required' });
  // } else if (!dateOfBirth || dateOfBirth === undefined || dateOfBirth === null || dateOfBirth === '') {
  //   return res.status(400).json({ message: 'dateOfBirth is required' });
  // } else if (!gender || gender === undefined || gender === null || gender === '') {
  //   return res.status(400).json({ message: 'gender is required' });
  // } else if (!age || age === undefined || age === null || age === '') {
  //   return res.status(400).json({ message: 'age is required' });
  // } else if (!role || role === undefined || role === null || role === '') {
  //   return res.status(400).json({ message: 'Type is required' });
  // } else if (!occupation || occupation === undefined || occupation === null || occupation === '') {
  //   return res.status(400).json({ message: 'occupation is required' });
  // } else if (!address || address === undefined || address === null || address === '') {
  //   return res.status(400).json({ message: 'address is required' });
  // } 



  try {

    const userExist = await prisma.user.findFirst({
      where: {
        email: email
      }
    })

    if (userExist) {
      return res.status(400).json({ message: 'User already exist' });
    }

    const mobileExist = await prisma.user.findFirst({
      where: {
        mobile: mobile
      }
    })

    if (mobileExist) {
      return res.status(400).json({ message: 'Mobile number already exist' });
    }

    
    const trimEmail = await email.split('@')[0];

    const newUser = await prisma.user.create({
      data: 
      {
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
        address: address
      }
     })
    console.log(newUser)

    return res.status(201).json({ result: newUser });
  } catch (error) {
   return res.status(400).json({ message: error }); 
  }
}


export const UserController = {
  createUser,
};
