ALTER TABLE "product_landings" ADD COLUMN "category" text DEFAULT 'kasdienai' NOT NULL;
UPDATE "product_landings" SET "category" = 'automobiliui' WHERE "slug" IN ('obd2', 'automobilio-laikiklis');
UPDATE "product_landings" SET "category" = 'namams' WHERE "slug" IN ('didelis-plepus-zaislas', 'namu-akcentas', 'medinis-svyravimas');