/*
  Warnings:

  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "contactNo" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL
);
INSERT INTO "new_User" ("contactNo", "email", "firstName", "id", "isActive", "lastName", "password", "userName") SELECT "contactNo", "email", "firstName", "id", "isActive", "lastName", "password", "userName" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
