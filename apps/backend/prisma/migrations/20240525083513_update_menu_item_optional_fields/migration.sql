-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MenuItems" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemName" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "foodType" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "waitingTime" INTEGER,
    "spiceScale" TEXT NOT NULL,
    "servingTime" TEXT,
    "itemImageUrl" TEXT,
    "categoryId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MenuItems_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MenuCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MenuItems_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MenuItems" ("availability", "categoryId", "createdAt", "description", "foodType", "id", "isActive", "itemImageUrl", "itemName", "price", "servingTime", "shopId", "shortCode", "spiceScale", "updatedAt", "waitingTime") SELECT "availability", "categoryId", "createdAt", "description", "foodType", "id", "isActive", "itemImageUrl", "itemName", "price", "servingTime", "shopId", "shortCode", "spiceScale", "updatedAt", "waitingTime" FROM "MenuItems";
DROP TABLE "MenuItems";
ALTER TABLE "new_MenuItems" RENAME TO "MenuItems";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
