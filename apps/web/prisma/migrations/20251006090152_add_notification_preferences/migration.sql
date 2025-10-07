-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "fbrSubmissionNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "invoiceNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "marketingEmails" BOOLEAN NOT NULL DEFAULT false;
