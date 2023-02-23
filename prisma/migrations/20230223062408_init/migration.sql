-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "PhraseShare" AS ENUM ('RESTRICTED', 'PUBLIC');

-- CreateEnum
CREATE TYPE "PhraseType" AS ENUM ('CATCHPHRASE', 'PROVERB', 'QUOTATION', 'OTHER');

-- CreateEnum
CREATE TYPE "LikeObjectType" AS ENUM ('PHRASE', 'COMMENT');

-- CreateEnum
CREATE TYPE "MessageObjectType" AS ENUM ('PHRASE', 'PM');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "username_lower" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passwords" (
    "hash" TEXT NOT NULL,
    "user_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "phrases" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT,
    "text" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "type" "PhraseType" NOT NULL,
    "description" TEXT,
    "attribution" TEXT,
    "source" TEXT,
    "share" "PhraseShare" NOT NULL,
    "favorites_count" INTEGER NOT NULL DEFAULT 0,
    "likes_total" INTEGER NOT NULL DEFAULT 0,
    "likes_sum" INTEGER NOT NULL DEFAULT 0,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "phrases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" TEXT NOT NULL,
    "is_dislike" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "objectType" "LikeObjectType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_items" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "list_id" TEXT NOT NULL,
    "phrase_id" TEXT NOT NULL,

    CONSTRAINT "list_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "parent_id" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "object_id" TEXT NOT NULL,
    "object_type" "MessageObjectType" NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PhraseToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_lower_key" ON "users"("username_lower");

-- CreateIndex
CREATE UNIQUE INDEX "passwords_user_id_key" ON "passwords"("user_id");

-- CreateIndex
CREATE INDEX "phrases_likes_total_idx" ON "phrases"("likes_total" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "likes_objectId_objectType_user_id_key" ON "likes"("objectId", "objectType", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_language_key" ON "tags"("name", "language");

-- CreateIndex
CREATE UNIQUE INDEX "_PhraseToTag_AB_unique" ON "_PhraseToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PhraseToTag_B_index" ON "_PhraseToTag"("B");

-- AddForeignKey
ALTER TABLE "passwords" ADD CONSTRAINT "passwords_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phrases" ADD CONSTRAINT "phrases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "phrases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_phrase_id_fkey" FOREIGN KEY ("phrase_id") REFERENCES "phrases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "phrase_message_fk" FOREIGN KEY ("object_id") REFERENCES "phrases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "receiver_message_fk" FOREIGN KEY ("object_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhraseToTag" ADD CONSTRAINT "_PhraseToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "phrases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhraseToTag" ADD CONSTRAINT "_PhraseToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
