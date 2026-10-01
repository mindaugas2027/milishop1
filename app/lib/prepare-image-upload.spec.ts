import { afterEach, describe, expect, it, vi } from "vitest";

import { prepareImageUpload } from "./prepare-image-upload";

describe("prepareImageUpload", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps small images unchanged", async () => {
    const file = new File([new Uint8Array([1])], "small.png", { type: "image/png" });

    await expect(prepareImageUpload(file)).resolves.toBe(file);
  });

  it("resizes large images to a compact WebP before upload", async () => {
    const file = new File([new Uint8Array(2 * 1024 * 1024 + 1)], "large.jpg", { type: "image/jpeg" });
    const bitmap = { width: 4000, height: 3000, close: vi.fn() };
    const canvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => ({ drawImage: vi.fn() })),
      toBlob: vi.fn((callback: BlobCallback) => callback(new Blob([new Uint8Array(32)], { type: "image/webp" }))),
    };
    vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue(bitmap));
    vi.stubGlobal("document", { createElement: vi.fn(() => canvas) });

    const prepared = await prepareImageUpload(file);

    expect(prepared.type).toBe("image/webp");
    expect(prepared.name).toBe("large.webp");
    expect(prepared.size).toBeLessThan(2 * 1024 * 1024);
    expect(canvas.width).toBe(1800);
    expect(canvas.height).toBe(1350);
    expect(bitmap.close).toHaveBeenCalledOnce();
  });
});