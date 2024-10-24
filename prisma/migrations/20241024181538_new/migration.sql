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
    "email" VARCHAR(100) NOT NULL,
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
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(100) NOT NULL,
    "markedId" VARCHAR(100) NOT NULL,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "uniqueIdentifier" VARCHAR(50) NOT NULL,
    "locationName" VARCHAR(100) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectedLocation" (
    "id" TEXT NOT NULL,
    "fromLocationId" TEXT NOT NULL,
    "toLocationId" TEXT NOT NULL,
    "distance" INTEGER,

    CONSTRAINT "ConnectedLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search-request" (
    "id" TEXT NOT NULL,
    "fullName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "gender" VARCHAR(10) NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "currentLocation" VARCHAR(100) NOT NULL,
    "destinationLocation" VARCHAR(100) NOT NULL,
    "filterVehicleType" VARCHAR(20),
    "filterVehicleCapacity" VARCHAR(20),
    "filterGenderType" VARCHAR(10),
    "matched" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search-request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat-rooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "chat-rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "chatRoomId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserChats" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");

-- CreateIndex
CREATE INDEX "users_fullName_userName_idx" ON "users"("fullName", "userName");

-- CreateIndex
CREATE INDEX "bookmarks_userId_markedId_idx" ON "bookmarks"("userId", "markedId");

-- CreateIndex
CREATE INDEX "Location_uniqueIdentifier_idx" ON "Location"("uniqueIdentifier");

-- CreateIndex
CREATE INDEX "Location_locationName_idx" ON "Location"("locationName");

-- CreateIndex
CREATE INDEX "ConnectedLocation_fromLocationId_toLocationId_idx" ON "ConnectedLocation"("fromLocationId", "toLocationId");

-- CreateIndex
CREATE INDEX "search-request_fullName_email_currentLocation_destinationLo_idx" ON "search-request"("fullName", "email", "currentLocation", "destinationLocation");

-- CreateIndex
CREATE INDEX "messages_chatRoomId_senderId_idx" ON "messages"("chatRoomId", "senderId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserChats_AB_unique" ON "_UserChats"("A", "B");

-- CreateIndex
CREATE INDEX "_UserChats_B_index" ON "_UserChats"("B");

-- AddForeignKey
ALTER TABLE "ConnectedLocation" ADD CONSTRAINT "ConnectedLocation_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectedLocation" ADD CONSTRAINT "ConnectedLocation_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search-request" ADD CONSTRAINT "search-request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "chat-rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserChats" ADD CONSTRAINT "_UserChats_A_fkey" FOREIGN KEY ("A") REFERENCES "chat-rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserChats" ADD CONSTRAINT "_UserChats_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
