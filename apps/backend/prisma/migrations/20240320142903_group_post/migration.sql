-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expiry_timestamp" SET DEFAULT NOW() + interval '24 hours';

-- CreateTable
CREATE TABLE "GroupPost" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "GroupPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOnGroupPost" (
    "user_id" INTEGER NOT NULL,
    "group_post_id" INTEGER NOT NULL,

    CONSTRAINT "UserOnGroupPost_pkey" PRIMARY KEY ("user_id","group_post_id")
);

-- AddForeignKey
ALTER TABLE "UserOnGroupPost" ADD CONSTRAINT "UserOnGroupPost_group_post_id_fkey" FOREIGN KEY ("group_post_id") REFERENCES "GroupPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnGroupPost" ADD CONSTRAINT "UserOnGroupPost_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
