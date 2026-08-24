-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "StoryType" AS ENUM ('INTERVIEW', 'ESSAY', 'MAKER_PROFILE', 'PODCAST', 'JOURNAL');

-- CreateEnum
CREATE TYPE "StoryStatus" AS ENUM ('DRAFT', 'PENDING', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MakerStatus" AS ENUM ('PENDING', 'APPROVED', 'FEATURED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "StoryType" NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "featuredImage" TEXT,
    "author" TEXT,
    "status" "StoryStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "isDevelopmentContent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "makerId" TEXT,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Maker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bio" TEXT,
    "location" TEXT,
    "photo" TEXT,
    "website" TEXT,
    "socialLinks" JSONB,
    "workshopInfo" TEXT,
    "status" "MakerStatus" NOT NULL DEFAULT 'PENDING',
    "isDevelopmentContent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Maker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorySubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "location" TEXT,
    "craftCategory" TEXT,
    "website" TEXT,
    "socialLinks" JSONB,
    "photo" TEXT,
    "permissionToContact" BOOLEAN NOT NULL DEFAULT false,
    "publicationPermission" BOOLEAN NOT NULL DEFAULT false,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "publishedStoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorySubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MakerSubmission" (
    "id" TEXT NOT NULL,
    "makerName" TEXT NOT NULL,
    "submitterName" TEXT NOT NULL,
    "submitterEmail" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "craftCategory" TEXT,
    "website" TEXT,
    "socialLinks" JSONB,
    "photo" TEXT,
    "workshopInformation" TEXT,
    "recommendationReason" TEXT,
    "permissionToContact" BOOLEAN NOT NULL DEFAULT false,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "convertedToMakerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MakerSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gathering" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isDevelopmentContent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gathering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StoryCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StoryCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MakerCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MakerCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Story_slug_key" ON "Story"("slug");

-- CreateIndex
CREATE INDEX "Story_status_idx" ON "Story"("status");

-- CreateIndex
CREATE INDEX "Story_type_idx" ON "Story"("type");

-- CreateIndex
CREATE INDEX "Story_publishedAt_idx" ON "Story"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Maker_slug_key" ON "Maker"("slug");

-- CreateIndex
CREATE INDEX "Maker_status_idx" ON "Maker"("status");

-- CreateIndex
CREATE INDEX "StorySubmission_status_idx" ON "StorySubmission"("status");

-- CreateIndex
CREATE INDEX "MakerSubmission_status_idx" ON "MakerSubmission"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Gathering_slug_key" ON "Gathering"("slug");

-- CreateIndex
CREATE INDEX "Gathering_isPublished_idx" ON "Gathering"("isPublished");

-- CreateIndex
CREATE INDEX "Gathering_startsAt_idx" ON "Gathering"("startsAt");

-- CreateIndex
CREATE INDEX "_StoryCategories_B_index" ON "_StoryCategories"("B");

-- CreateIndex
CREATE INDEX "_MakerCategories_B_index" ON "_MakerCategories"("B");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_makerId_fkey" FOREIGN KEY ("makerId") REFERENCES "Maker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorySubmission" ADD CONSTRAINT "StorySubmission_publishedStoryId_fkey" FOREIGN KEY ("publishedStoryId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MakerSubmission" ADD CONSTRAINT "MakerSubmission_convertedToMakerId_fkey" FOREIGN KEY ("convertedToMakerId") REFERENCES "Maker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StoryCategories" ADD CONSTRAINT "_StoryCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StoryCategories" ADD CONSTRAINT "_StoryCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MakerCategories" ADD CONSTRAINT "_MakerCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MakerCategories" ADD CONSTRAINT "_MakerCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Maker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

