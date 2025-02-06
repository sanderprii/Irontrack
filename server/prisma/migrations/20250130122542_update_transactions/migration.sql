-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "affiliateId" INTEGER NOT NULL,
    "planId" INTEGER,
    "userPlanId" INTEGER,
    "memberId" INTEGER NOT NULL,
    CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transactions_userPlanId_fkey" FOREIGN KEY ("userPlanId") REFERENCES "UserPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "transactions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "transactions_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transactions_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Members" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("affiliateId", "amount", "createdAt", "description", "id", "invoiceNumber", "memberId", "status", "type", "userId") SELECT "affiliateId", "amount", "createdAt", "description", "id", "invoiceNumber", "memberId", "status", "type", "userId" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
