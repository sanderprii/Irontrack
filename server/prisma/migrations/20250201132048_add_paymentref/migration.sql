/*
  Warnings:

  - Added the required column `paymentRef` to the `CreditTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CreditTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "paymentRef" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "creditAmount" REAL NOT NULL,
    "decrease" BOOLEAN NOT NULL DEFAULT false,
    "affiliateId" INTEGER NOT NULL,
    "creditId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    CONSTRAINT "CreditTransaction_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "Credit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CreditTransaction_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CreditTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CreditTransaction" ("affiliateId", "createdAt", "creditAmount", "creditId", "decrease", "description", "id", "userId") SELECT "affiliateId", "createdAt", "creditAmount", "creditId", "decrease", "description", "id", "userId" FROM "CreditTransaction";
DROP TABLE "CreditTransaction";
ALTER TABLE "new_CreditTransaction" RENAME TO "CreditTransaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
