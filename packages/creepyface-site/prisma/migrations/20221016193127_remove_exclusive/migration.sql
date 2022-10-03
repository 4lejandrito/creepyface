/*
  Warnings:

  - You are about to drop the column `exclusive` on the `Creepyface` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Creepyface" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "canUseForResearch" BOOLEAN NOT NULL,
    "canUseAsSample" BOOLEAN NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "namespace" TEXT
);
INSERT INTO "new_Creepyface" ("approved", "canUseAsSample", "canUseForResearch", "namespace", "timestamp", "uuid") SELECT "approved", "canUseAsSample", "canUseForResearch", "namespace", "timestamp", "uuid" FROM "Creepyface";
DROP TABLE "Creepyface";
ALTER TABLE "new_Creepyface" RENAME TO "Creepyface";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
