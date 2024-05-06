-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'others');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('traveler', 'sharer');

-- CreateEnum
CREATE TYPE "Occupation" AS ENUM ('student', 'corporate');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" VARCHAR(50) NOT NULL,
    "userName" VARCHAR(30),
    "email" TEXT NOT NULL,
    "password" VARCHAR(30) NOT NULL,
    "mobile" VARCHAR(15) NOT NULL,
    "gender" "Gender" NOT NULL,
    "role" "Role" NOT NULL,
    "age" INTEGER NOT NULL,
    "dateOfBirth" VARCHAR(30) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "occupation" "Occupation" NOT NULL,
    "refreshToken" TEXT,
    "avatar" TEXT,
    "coverImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");
