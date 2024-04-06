/*
  Warnings:

  - A unique constraint covering the columns `[event_id,email]` on the table `attendeess` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "attendeess_event_id_email_key" ON "attendeess"("event_id", "email");
