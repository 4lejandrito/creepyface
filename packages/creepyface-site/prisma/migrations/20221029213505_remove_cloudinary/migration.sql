/*
  Warnings:

  - You are about to drop the `CloudinaryURL` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feature` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CloudinaryURL";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Feature";
PRAGMA foreign_keys=on;
