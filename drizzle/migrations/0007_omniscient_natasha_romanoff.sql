CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"order_number" text NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_phone" text NOT NULL,
	"shipping_address" text NOT NULL,
	"payment_method" text DEFAULT 'bank_transfer' NOT NULL,
	"payment_status" text DEFAULT 'unpaid' NOT NULL,
	"status" text DEFAULT 'received' NOT NULL,
	"items" text DEFAULT '[]' NOT NULL,
	"total_cents" text DEFAULT '0' NOT NULL,
	"cost_cents" text DEFAULT '0' NOT NULL,
	"profit_cents" text DEFAULT '0' NOT NULL,
	"tracking_code" text DEFAULT '' NOT NULL,
	"created_at" text DEFAULT now() NOT NULL,
	"updated_at" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_landings" ADD COLUMN "cost_price" text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "orders_order_number_uidx" ON "orders" USING btree ("order_number");--> statement-breakpoint
CREATE INDEX "orders_status_created_at_idx" ON "orders" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");