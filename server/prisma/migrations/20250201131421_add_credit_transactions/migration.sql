-- CreateTable
CREATE TABLE "CreditTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
