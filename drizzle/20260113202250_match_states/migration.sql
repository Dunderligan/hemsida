CREATE TYPE "match_state" AS ENUM('scheduled', 'played', 'walkover', 'cancelled');--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "state" "match_state" DEFAULT 'scheduled'::"match_state" NOT NULL;--> statement-breakpoint
UPDATE "match" SET "state" = 'played'::"match_state" WHERE "played" = true;
ALTER TABLE "match" DROP COLUMN "played";
