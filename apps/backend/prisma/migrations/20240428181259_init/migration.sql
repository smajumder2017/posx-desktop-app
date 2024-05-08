-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "contactNo" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "roleId" TEXT NOT NULL,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShopType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserShop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    CONSTRAINT "UserShop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserShop_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopName" TEXT NOT NULL,
    "shopCode" TEXT NOT NULL,
    "shopTypeId" TEXT NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "contactNo" TEXT NOT NULL,
    CONSTRAINT "Shop_shopTypeId_fkey" FOREIGN KEY ("shopTypeId") REFERENCES "ShopType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_value_key" ON "Role"("value");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "ShopType_value_key" ON "ShopType"("value");
