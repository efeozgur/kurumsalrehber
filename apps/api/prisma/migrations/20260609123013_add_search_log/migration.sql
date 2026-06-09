-- CreateTable
CREATE TABLE "SearchLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "query" TEXT,
    "departmentId" INTEGER,
    "titleId" INTEGER,
    "contactId" INTEGER,
    "resultCount" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL DEFAULT 'search',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
