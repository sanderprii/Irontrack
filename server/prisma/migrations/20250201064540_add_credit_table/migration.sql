/*
  Warnings:

  - You are about to drop the column `credit` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Credit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "credit" REAL NOT NULL DEFAULT 0.0,
    "affiliateId" INTEGER NOT NULL,
    CONSTRAINT "Credit_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Credit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Members" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "affiliateId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "visitCount" INTEGER DEFAULT 0,
    "addScoreCount" INTEGER DEFAULT 0,
    "atRisk" BOOLEAN NOT NULL DEFAULT false,
    "ristData" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Members_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Members" ("addScoreCount", "affiliateId", "atRisk", "id", "isActive", "ristData", "userId", "visitCount") SELECT "addScoreCount", "affiliateId", "atRisk", "id", "isActive", "ristData", "userId", "visitCount" FROM "Members";
DROP TABLE "Members";
ALTER TABLE "new_Members" RENAME TO "Members";
CREATE UNIQUE INDEX "Members_userId_affiliateId_key" ON "Members"("userId", "affiliateId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT,
    "affiliateOwner" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monthlyGoal" INTEGER,
    "phone" TEXT,
    "homeAffiliate" INTEGER
);
INSERT INTO "new_User" ("affiliateOwner", "createdAt", "email", "fullName", "homeAffiliate", "id", "monthlyGoal", "password", "phone") SELECT "affiliateOwner", "createdAt", "email", "fullName", "homeAffiliate", "id", "monthlyGoal", "password", "phone" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Credit_userId_affiliateId_key" ON "Credit"("userId", "affiliateId");
