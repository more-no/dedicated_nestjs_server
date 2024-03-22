/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `PersonalData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PersonalData_user_id_key" ON "PersonalData"("user_id");
