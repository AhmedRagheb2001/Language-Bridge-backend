/*
  Warnings:

  - A unique constraint covering the columns `[displayName]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Profile_displayName_key" ON "Profile"("displayName");
