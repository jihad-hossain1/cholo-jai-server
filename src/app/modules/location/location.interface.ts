export interface IUser {
  id: string;
  userName: string;
  fullName?: string;
  email: string;
  mobile: string;
  avatar?: string;
  password: string;
  coverImage?: string;
  refreshToken?: string;
  gender: Gender;
  role: Role;
  dateOfBirth: string;
  age: number;
  address: string;
  occupation: Occupation;
  createdAt: Date;
  updatedAt: Date;
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export enum Role {
  traveler = "traveler",
  sharer = "sharer",
}

export enum Occupation {
  student = "student",
  faculty = "faculty",
}
