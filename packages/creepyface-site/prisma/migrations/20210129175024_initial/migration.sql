-- CreateTable
CREATE TABLE "Creepyface" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "canUseForResearch" BOOLEAN NOT NULL,
    "canUseAsSample" BOOLEAN NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "namespace" TEXT,
    "exclusive" BOOLEAN NOT NULL
);