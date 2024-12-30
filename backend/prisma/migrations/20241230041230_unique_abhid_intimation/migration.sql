/*
  Warnings:

  - A unique constraint covering the columns `[abhaId]` on the table `Intimation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Intimation_abhaId_key" ON "Intimation"("abhaId");
