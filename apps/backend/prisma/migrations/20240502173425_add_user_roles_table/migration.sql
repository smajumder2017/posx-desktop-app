-- CreateTable
CREATE TABLE "UserRoles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    CONSTRAINT "UserRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "isActive" BOOLEAN NOT NULL,
    "roleId" TEXT NOT NULL
);
INSERT INTO "new_User" ("contactNo", "email", "firstName", "id", "isActive", "lastName", "password", "roleId", "userName") SELECT "contactNo", "email", "firstName", "id", "isActive", "lastName", "password", "roleId", "userName" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
