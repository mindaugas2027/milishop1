import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { supabaseProductImageUploadProvider } from "./supabase-product-image-upload";

describe("Supabase product image upload provider", () => {
  beforeEach(() => {
    vi.stubEnv("SUPABASE_URL", "https://milishop-example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-example");
    vi.stubEnv("NODE_ENV", "test");
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("creates a public product-images bucket and uploads the image", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 201 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    const result = await supabaseProductImageUploadProvider.upload({
      data: new Uint8Array([1, 2, 3]),
      filename: "product.png",
      mimeType: "image/png",
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[0]).toBe("https://milishop-example.supabase.co/storage/v1/bucket");
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({ id: "product-images", public: true });
    expect(fetchMock.mock.calls[1]?.[0]).toMatch(/^https:\/\/milishop-example\.supabase\.co\/storage\/v1\/object\/product-images\//);
    expect(result).toMatchObject({
      provider: "milishop-supabase-product-images",
      url: expect.stringMatching(/^https:\/\/milishop-example\.supabase\.co\/storage\/v1\/object\/public\/product-images\//),
    });
  });

  it("makes an existing bucket public before uploading", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 409 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    await supabaseProductImageUploadProvider.upload({
      data: new Uint8Array([1]),
      mimeType: "image/jpeg",
    });

    expect(fetchMock.mock.calls[1]?.[0]).toBe("https://milishop-example.supabase.co/storage/v1/bucket/product-images");
    expect(fetchMock.mock.calls[1]?.[1]?.method).toBe("PUT");
  });

  it("fails with setup guidance when Supabase credentials are missing", async () => {
    vi.stubEnv("SUPABASE_URL", "");

    await expect(supabaseProductImageUploadProvider.upload({
      data: new Uint8Array([1]),
      mimeType: "image/png",
    })).rejects.toThrow("SUPABASE_URL arba SUPABASE_SERVICE_ROLE_KEY");
    expect(fetch).not.toHaveBeenCalled();
  });
});