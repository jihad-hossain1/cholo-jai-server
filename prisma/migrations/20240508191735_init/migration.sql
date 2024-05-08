-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'others');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('traveler', 'sharer');

-- CreateEnum
CREATE TYPE "Occupation" AS ENUM ('student', 'corporate');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullName" VARCHAR(50) NOT NULL,
    "userName" VARCHAR(30),
    "email" TEXT NOT NULL,
    "password" VARCHAR(150) NOT NULL,
    "mobile" VARCHAR(11) NOT NULL,
    "gender" "Gender" NOT NULL,
    "role" "Role" NOT NULL,
    "age" INTEGER NOT NULL,
    "dateOfBirth" VARCHAR(25) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "occupation" "Occupation" NOT NULL,
    "refreshToken" TEXT,
    "avatar" TEXT,
    "coverImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchRequest" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "contactNumber" VARCHAR(11) NOT NULL,
    "role" "Role" NOT NULL,
    "currentLocation" TEXT NOT NULL,
    "destinationLocation" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");
