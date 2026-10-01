import { afterEach, describe, expect, it, vi } from "vitest";

import { uploadProductImage } from "./upload-product-image";

describe("uploadProductImage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends the original file as multipart data to the backend", async () => {
    const file = new File([new Uint8Array([1, 2, 3])], "category.png", { type: "image/png" });
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      src: "https://shop.example/storage/category-image",
      provider: "supabase",
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await uploadProductImage(file);
    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;

    expect(fetchMock.mock.calls[0]?.[0]).toBe("/api/admin/product-image");
    expect(request.method).toBe("POST");
    expect(request.body).toBeInstanceOf(FormData);
    expect((request.body as FormData).get("image")).toBe(file);
    expect(request.headers).toBeUndefined();
    expect(result).toMatchObject({ src: "https://shop.example/storage/category-image", alt: "category" });
  });

  it("shows the backend upload error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      message: "Supabase atmetė nuotraukos įkėlimą (HTTP 403).",
    }), { status: 503, headers: { "Content-Type": "application/json" } })));
    const file = new File([new Uint8Array([1])], "category.png", { type: "image/png" });

    await expect(uploadProductImage(file)).rejects.toThrow("Supabase atmetė nuotraukos įkėlimą");
  });

  it("rejects images above the backend upload limit before sending", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const file = new File([new Uint8Array(4 * 1024 * 1024 + 1)], "large.png", { type: "image/png" });

    await expect(uploadProductImage(file)).rejects.toThrow("4 MB");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});