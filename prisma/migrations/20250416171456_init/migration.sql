-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uname" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "creator" INTEGER NOT NULL,
    "subgroup" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "post_id" INTEGER NOT NULL,
    "creator" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "Vote" (
    "user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    PRIMARY KEY ("user_id", "post_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uname_key" ON "User"("uname");
