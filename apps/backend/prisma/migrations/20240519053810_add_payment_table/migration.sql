/*
  Warnings:

  - You are about to drop the column `paymentMode` on the `Billing` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "billId" TEXT NOT NULL,
    "amountRecieved" REAL NOT NULL,
    "paymentMode" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Billing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Billing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isSetteled" BOOLEAN NOT NULL,
    "isSynced" BOOLEAN NOT NULL DEFAULT false,
    "amount" REAL NOT NULL,
    "discount" REAL NOT NULL DEFAULT 0,
    "gst" REAL NOT NULL DEFAULT 0,
    "serviceCharges" REAL NOT NULL DEFAULT 0,
    "totalAmount" REAL NOT NULL,
    "roundoffDiff" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Billing_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Billing_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Billing_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Billing_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Billing" ("amount", "createdAt", "customerId", "discount", "employeeId", "gst", "id", "isActive", "isSetteled", "isSynced", "orderId", "roundoffDiff", "serviceCharges", "shopId", "totalAmount", "updatedAt") SELECT "amount", "createdAt", "customerId", "discount", "employeeId", "gst", "id", "isActive", "isSetteled", "isSynced", "orderId", "roundoffDiff", "serviceCharges", "shopId", "totalAmount", "updatedAt" FROM "Billing";
DROP TABLE "Billing";
ALTER TABLE "new_Billing" RENAME TO "Billing";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
