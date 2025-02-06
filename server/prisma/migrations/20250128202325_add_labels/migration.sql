-- AlterTable
ALTER TABLE "User" ADD COLUMN "phone" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClassSchedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trainingType" TEXT,
    "trainingName" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL,
    "trainer" TEXT,
    "memberCapacity" INTEGER NOT NULL,
    "location" TEXT,
    "repeatWeekly" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" INTEGER NOT NULL,
    "affiliateId" INTEGER NOT NULL,
    "seriesId" INTEGER,
    "wodName" TEXT,
    "wodType" TEXT,
    "description" TEXT,
    "canRegister" BOOLEAN NOT NULL DEFAULT false,
    "freeClass" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ClassSchedule_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClassSchedule_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ClassSchedule" ("affiliateId", "description", "duration", "id", "location", "memberCapacity", "ownerId", "repeatWeekly", "seriesId", "time", "trainer", "trainingName", "trainingType", "wodName", "wodType") SELECT "affiliateId", "description", "duration", "id", "location", "memberCapacity", "ownerId", "repeatWeekly", "seriesId", "time", "trainer", "trainingName", "trainingType", "wodName", "wodType" FROM "ClassSchedule";
DROP TABLE "ClassSchedule";
ALTER TABLE "new_ClassSchedule" RENAME TO "ClassSchedule";
CREATE TABLE "new_Members" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "affiliateId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "visitCount" INTEGER NOT NULL DEFAULT 0,
    "addScoreCount" INTEGER NOT NULL DEFAULT 0,
    "atRisk" BOOLEAN NOT NULL DEFAULT false,
    "ristData" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Members_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Members" ("affiliateId", "id", "userId") SELECT "affiliateId", "id", "userId" FROM "Members";
DROP TABLE "Members";
ALTER TABLE "new_Members" RENAME TO "Members";
CREATE UNIQUE INDEX "Members_userId_affiliateId_key" ON "Members"("userId", "affiliateId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
