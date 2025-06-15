/*
  Warnings:

  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupPrivilege` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Privilege` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPrivilege` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroupPrivilege" DROP CONSTRAINT "GroupPrivilege_groupName_fkey";

-- DropForeignKey
ALTER TABLE "GroupPrivilege" DROP CONSTRAINT "GroupPrivilege_privilegeId_fkey";

-- DropForeignKey
ALTER TABLE "UserGroup" DROP CONSTRAINT "UserGroup_groupName_fkey";

-- DropForeignKey
ALTER TABLE "UserGroup" DROP CONSTRAINT "UserGroup_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserPrivilege" DROP CONSTRAINT "UserPrivilege_privilegeId_fkey";

-- DropForeignKey
ALTER TABLE "UserPrivilege" DROP CONSTRAINT "UserPrivilege_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "privilege" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Pengguna';

-- DropTable
DROP TABLE "Group";

-- DropTable
DROP TABLE "GroupPrivilege";

-- DropTable
DROP TABLE "Privilege";

-- DropTable
DROP TABLE "UserGroup";

-- DropTable
DROP TABLE "UserPrivilege";

-- CreateTable
CREATE TABLE "WarehouseLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ItemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WarehouseLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarehouseCupBoard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "WarehouseCupBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarehouseItem" (
    "id" TEXT NOT NULL,
    "cupBoardId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "expired" TIMESTAMP(3),
    "inCupBoard" BOOLEAN,
    "lastCheck" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarehouseItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WarehouseCupBoard_id_key" ON "WarehouseCupBoard"("id");

-- CreateIndex
CREATE UNIQUE INDEX "WarehouseCupBoard_name_key" ON "WarehouseCupBoard"("name");

-- AddForeignKey
ALTER TABLE "WarehouseLog" ADD CONSTRAINT "WarehouseLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseLog" ADD CONSTRAINT "WarehouseLog_ItemId_fkey" FOREIGN KEY ("ItemId") REFERENCES "WarehouseItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseItem" ADD CONSTRAINT "WarehouseItem_cupBoardId_fkey" FOREIGN KEY ("cupBoardId") REFERENCES "WarehouseCupBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
