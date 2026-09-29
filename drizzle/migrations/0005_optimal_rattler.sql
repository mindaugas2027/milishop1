CREATE TABLE "store_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"caption" text DEFAULT '' NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"enabled" text DEFAULT 'true' NOT NULL,
	"sort_order" text DEFAULT '0' NOT NULL,
	"created_at" text DEFAULT now() NOT NULL,
	"updated_at" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "store_categories_slug_uidx" ON "store_categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "store_categories_enabled_order_idx" ON "store_categories" USING btree ("enabled","sort_order");--> statement-breakpoint
INSERT INTO "store_categories" ("id", "slug", "name", "caption", "image", "enabled", "sort_order") VALUES
	(gen_random_uuid()::text, 'automobiliui', 'Automobiliui', 'Išmaniau kiekvienai kelionei', '', 'true', '10'),
	(gen_random_uuid()::text, 'kasdienai', 'Kasdienai', 'Maži daiktai, didelis patogumas', '', 'true', '20'),
	(gen_random_uuid()::text, 'namams', 'Namams', 'Ramūs akcentai tavo erdvei', '', 'true', '30')
ON CONFLICT ("slug") DO NOTHING;