-- CreateTable
CREATE TABLE "Usage" (
    "script" TEXT NOT NULL,
    "referer" TEXT NOT NULL,

    PRIMARY KEY ("script", "referer")
);
