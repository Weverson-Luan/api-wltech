ALTER TABLE "debtors" ADD COLUMN "principal_amount" double precision;--> statement-breakpoint
UPDATE "debtors" SET "principal_amount" = "amount" WHERE "principal_amount" IS NULL;--> statement-breakpoint
ALTER TABLE "debtors" ALTER COLUMN "principal_amount" SET NOT NULL;
