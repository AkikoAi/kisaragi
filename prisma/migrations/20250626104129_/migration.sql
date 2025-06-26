-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "terlambat" BOOLEAN NOT NULL DEFAULT false,
    "keterangan" TEXT,
    "clockIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clockInIp" TEXT NOT NULL,
    "clockInlatitude" DOUBLE PRECISION NOT NULL,
    "clockInlongitude" DOUBLE PRECISION NOT NULL,
    "clockOut" TIMESTAMP(3),
    "clockOutIp" TEXT,
    "clockOutlatitude" DOUBLE PRECISION,
    "clockOutlongitude" DOUBLE PRECISION,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
