/*
  Warnings:

  - You are about to alter the column `shopTypeId` on the `Shop` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `ShopType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `ShopType` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `roleId` on the `UserRoles` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Role` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `address` to the `Shop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Shop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pincode` to the `Shop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Shop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ShopType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserRoles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "License" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "License_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MenuCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "displayIndex" INTEGER NOT NULL,
    "shopId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MenuCategory_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MenuItems" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemName" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "foodType" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "waitingTime" INTEGER NOT NULL,
    "spiceScale" TEXT NOT NULL,
    "servingType" TEXT NOT NULL,
    "itemImageUrl" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MenuItems_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MenuCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MenuItems_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Shop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopName" TEXT NOT NULL,
    "shopCode" TEXT NOT NULL,
    "shopTypeId" INTEGER NOT NULL,
    "registrationNo" TEXT,
    "isActive" BOOLEAN NOT NULL,
    "contactNo" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "latitude" TEXT,
    "longitude" TEXT,
    CONSTRAINT "Shop_shopTypeId_fkey" FOREIGN KEY ("shopTypeId") REFERENCES "ShopType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Shop" ("contactNo", "id", "isActive", "registrationNo", "shopCode", "shopName", "shopTypeId") SELECT "contactNo", "id", "isActive", "registrationNo", "shopCode", "shopName", "shopTypeId" FROM "Shop";
DROP TABLE "Shop";
ALTER TABLE "new_Shop" RENAME TO "Shop";
CREATE UNIQUE INDEX "Shop_shopCode_key" ON "Shop"("shopCode");
CREATE UNIQUE INDEX "Shop_registrationNo_key" ON "Shop"("registrationNo");
CREATE TABLE "new_ShopType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ShopType" ("id", "value") SELECT "id", "value" FROM "ShopType";
DROP TABLE "ShopType";
ALTER TABLE "new_ShopType" RENAME TO "ShopType";
CREATE UNIQUE INDEX "ShopType_value_key" ON "ShopType"("value");
CREATE TABLE "new_UserRoles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserRoles" ("id", "roleId", "userId") SELECT "id", "roleId", "userId" FROM "UserRoles";
DROP TABLE "UserRoles";
ALTER TABLE "new_UserRoles" RENAME TO "UserRoles";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "contactNo" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("contactNo", "email", "firstName", "id", "isActive", "lastName", "password", "userName") SELECT "contactNo", "email", "firstName", "id", "isActive", "lastName", "password", "userName" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");
CREATE TABLE "new_Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Role" ("id", "value") SELECT "id", "value" FROM "Role";
DROP TABLE "Role";
ALTER TABLE "new_Role" RENAME TO "Role";
CREATE UNIQUE INDEX "Role_value_key" ON "Role"("value");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "License_number_key" ON "License"("number");
