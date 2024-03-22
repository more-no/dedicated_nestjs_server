/*
  Warnings:

  - You are about to alter the column `title` on the `GroupPost` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `body` on the `GroupPost` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.

*/
-- AlterTable
ALTER TABLE "GroupPost" ALTER COLUMN "title" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "body" SET DATA TYPE VARCHAR(300);

-- CreateTable
CREATE TABLE "PersonalData" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "first_name" VARCHAR(20) NOT NULL,
    "last_name" VARCHAR(20) NOT NULL,
    "age" INTEGER NOT NULL,
    "nationality" VARCHAR(20) NOT NULL,

    CONSTRAINT "PersonalData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PersonalData" ADD CONSTRAINT "PersonalData_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
