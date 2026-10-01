import { isActionContractError } from "@agent-native/core/action";
import { uploadFile } from "@agent-native/core/file-upload";
import { createError, defineEventHandler, getHeader, readMultipartFormData } from "h3";

const maxImageBytes = 4 * 1024 * 1024;
const allowedImageTypes = new Set([
  "image/avif",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export default defineEventHandler(async (event) => {
  const contentLength = Number(getHeader(event, "content-length") ?? 0);
  if (contentLength > maxImageBytes + 64 * 1024) {
    throw createError({ statusCode: 413, statusMessage: "Nuotrauka turi būti ne didesnė nei 4 MB." });
  }

  let parts;
  try {
    parts = await readMultipartFormData(event);
  } catch {
    throw createError({ statusCode: 400, statusMessage: "Nepavyko perskaityti nuotraukos failo." });
  }

  const image = parts?.find((part) => part.name === "image" && part.filename);
  if (!image?.data?.byteLength || !image.type) {
    throw createError({ statusCode: 400, statusMessage: "Pasirinkite nuotraukos failą." });
  }
  if (image.data.byteLength > maxImageBytes) {
    throw createError({ statusCode: 413, statusMessage: "Nuotrauka turi būti ne didesnė nei 4 MB." });
  }

  const mimeType = image.type.split(";")[0]?.trim().toLowerCase();
  if (!mimeType || !allowedImageTypes.has(mimeType)) {
    throw createError({ statusCode: 415, statusMessage: "Palaikomi AVIF, GIF, HEIC, JPEG, PNG ir WebP failai." });
  }

  try {
    const result = await uploadFile({
      data: image.data,
      filename: image.filename,
      mimeType,
    });
    if (!result) {
      throw createError({
        statusCode: 503,
        statusMessage: "Nuotraukų saugykla neprieinama. Patikrinkite Supabase Storage serverio nustatymus.",
      });
    }
    return { src: result.url, provider: result.provider };
  } catch (error) {
    if (isActionContractError(error)) {
      throw createError({ statusCode: error.statusCode, statusMessage: error.message, message: error.message });
    }
    if (error && typeof error === "object" && "statusCode" in error) throw error;
    throw createError({ statusCode: 502, statusMessage: "Supabase Storage nuotraukos išsaugoti nepavyko." });
  }
});