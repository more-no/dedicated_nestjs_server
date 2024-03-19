/*
  Warnings:

  - You are about to drop the column `user_subscriptions` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expiry_timestamp" SET DEFAULT NOW() + interval '24 hours';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "user_subscriptions";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
