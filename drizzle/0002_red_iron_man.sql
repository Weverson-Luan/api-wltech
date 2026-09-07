ALTER TABLE "debtors" ADD COLUMN "uuid" text;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "uuid" text;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "description" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "debtors" ADD CONSTRAINT "debtors_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_uuid_unique" UNIQUE("uuid");