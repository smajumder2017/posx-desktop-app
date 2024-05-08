/*
  Warnings:

  - Added the required column `updatedAt` to the `Shop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserShop` table without a default value. This is not possible if the table is not empty.

*/
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Shop_shopTypeId_fkey" FOREIGN KEY ("shopTypeId") REFERENCES "ShopType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Shop" ("address", "city", "contactNo", "id", "isActive", "latitude", "longitude", "pincode", "registrationNo", "shopCode", "shopName", "shopTypeId", "state") SELECT "address", "city", "contactNo", "id", "isActive", "latitude", "longitude", "pincode", "registrationNo", "shopCode", "shopName", "shopTypeId", "state" FROM "Shop";
DROP TABLE "Shop";
ALTER TABLE "new_Shop" RENAME TO "Shop";
CREATE UNIQUE INDEX "Shop_shopCode_key" ON "Shop"("shopCode");
CREATE UNIQUE INDEX "Shop_registrationNo_key" ON "Shop"("registrationNo");
CREATE TABLE "new_UserShop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserShop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserShop_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserShop" ("id", "shopId", "userId") SELECT "id", "shopId", "userId" FROM "UserShop";
DROP TABLE "UserShop";
ALTER TABLE "new_UserShop" RENAME TO "UserShop";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
