-- AlterTable
ALTER TABLE "Shop" ADD COLUMN "cgstPercentage" INTEGER;
ALTER TABLE "Shop" ADD COLUMN "gstinNo" TEXT;
ALTER TABLE "Shop" ADD COLUMN "serviceChargePercentage" INTEGER;
ALTER TABLE "Shop" ADD COLUMN "sgstPercentage" INTEGER;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "contactNo" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("contactNo", "createdAt", "email", "firstName", "id", "isActive", "lastName", "password", "updatedAt", "userName") SELECT "contactNo", "createdAt", "email", "firstName", "id", "isActive", "lastName", "password", "updatedAt", "userName" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
