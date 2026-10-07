import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  stripeEvent: undefined as Record<string, unknown> | undefined,
  invalidSignature: false,
  update: undefined as Record<string, unknown> | undefined,
  order: { totalCents: "4980" } as { totalCents: string } | undefined,
}));

vi.mock("drizzle-orm", () => ({
  and: vi.fn(() => "where-clause"),
  eq: vi.fn(() => "where-clause"),
}));

vi.mock("h3", () => ({
  createError: (details: { statusCode: number; statusMessage: string }) => Object.assign(new Error(details.statusMessage), details),
  defineEventHandler: (handler: (event: unknown) => unknown) => handler,
  getHeader: () => "stripe-signature-example",
  readRawBody: async () => "signed-payload-example",
}));

vi.mock("../../db.js", () => ({
  getDb: () => ({
    select: () => ({
      from: () => ({ where: async () => (mocks.order ? [mocks.order] : []) }),
    }),
    update: () => ({
      set: (values: Record<string, unknown>) => {
        mocks.update = values;
        return { where: async () => undefined };
      },
    }),
  }),
  schema: {
    orders: { id: "id", totalCents: "totalCents", paymentStatus: "paymentStatus", updatedAt: "updatedAt" },
  },
}));

vi.mock("../../lib/stripe.js", () => ({
  getStripeClient: async () => ({
    webhooks: {
      constructEvent: () => {
        if (mocks.invalidSignature) throw new Error("signature mismatch");
        return mocks.stripeEvent;
      },
    },
  }),
  readStripeSecret: async () => "whsec_example",
  STRIPE_WEBHOOK_SECRET: "STRIPE_WEBHOOK_SECRET",
}));

import handler from "./stripe-webhook.post";

describe("stripe-webhook", () => {
  beforeEach(() => {
    mocks.invalidSignature = false;
    mocks.update = undefined;
    mocks.order = { totalCents: "4980" };
    mocks.stripeEvent = {
      type: "checkout.session.completed",
      data: {
        object: {
          mode: "payment",
          payment_status: "paid",
          currency: "eur",
          amount_total: 4980,
          metadata: { orderId: "order-example" },
        },
      },
    };
  });

  it("marks an order paid only for a paid euro session with the exact amount", async () => {
    await handler({} as never);

    expect(mocks.update).toMatchObject({ paymentStatus: "paid" });
  });

  it("does not mark an unpaid session as paid", async () => {
    const event = mocks.stripeEvent as { data: { object: { payment_status: string } } };
    event.data.object.payment_status = "unpaid";

    await handler({} as never);

    expect(mocks.update).toBeUndefined();
  });

  it("does not mark a session paid when the amount differs from the order", async () => {
    const event = mocks.stripeEvent as { data: { object: { amount_total: number } } };
    event.data.object.amount_total = 1;

    await handler({} as never);

    expect(mocks.update).toBeUndefined();
  });

  it("rejects invalid webhook signatures", async () => {
    mocks.invalidSignature = true;

    await expect(handler({} as never)).rejects.toMatchObject({ statusCode: 400 });
    expect(mocks.update).toBeUndefined();
  });
});