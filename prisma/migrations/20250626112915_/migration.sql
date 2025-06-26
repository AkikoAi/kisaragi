/*
  Warnings:

  - You are about to drop the column `clockInlatitude` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `clockInlongitude` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `clockOutlatitude` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `clockOutlongitude` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `clockInLocation` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "clockInlatitude",
DROP COLUMN "clockInlongitude",
DROP COLUMN "clockOutlatitude",
DROP COLUMN "clockOutlongitude",
ADD COLUMN     "clockInLocation" TEXT NOT NULL,
ADD COLUMN     "clockOutLocation" TEXT,
ALTER COLUMN "clockInIp" DROP NOT NULL;
