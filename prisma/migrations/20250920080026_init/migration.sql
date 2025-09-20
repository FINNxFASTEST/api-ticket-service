-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "seatNumber" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'THB',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
