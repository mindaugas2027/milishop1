import { fail } from "@agent-native/core/action";
import type { FileUploadProvider } from "@agent-native/core/file-upload";

const bucketName = "product-images";
const maxImageSize = 10 * 1024 * 1024;
const allowedImageTypes = ["image/avif", "image/gif", "image/heic", "image/heif", "image/jpeg", "image/png", "image/webp"];

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/+$/, ""); // guard:allow-env-credential — Supabase project URL is deploy-scoped storage configuration.
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(); // guard:allow-env-credential — service-role key is a deploy-scoped server secret for Supabase Storage.
  if (!url || !serviceRoleKey) {
    const missing = [
      !url ? "SUPABASE_URL" : null,
      !serviceRoleKey ? "SUPABASE_SERVICE_ROLE_KEY" : null,
    ].filter((key): key is string => key !== null);
    fail(`Nuotraukų saugykla nesukonfigūruota. Vercel serverio aplinkoje trūksta: ${missing.join(", ")}.`, {
      errorCode: "upload_storage_not_configured",
      statusCode: 503,
    });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    fail("Supabase nuotraukų saugyklos URL yra netinkamas.", {
      errorCode: "upload_storage_invalid_url",
      statusCode: 503,
    });
  }
  if (parsedUrl.protocol !== "https:" && process.env.NODE_ENV === "production") {
    fail("Produkcijoje Supabase URL turi naudoti HTTPS.", {
      errorCode: "upload_storage_invalid_url",
      statusCode: 503,
    });
  }

  return { url: parsedUrl.origin, serviceRoleKey };
}

function authHeaders(serviceRoleKey: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  };
}

async function storageFetch(url: string, options: RequestInit) {
  try {
    return await fetch(url, options);
  } catch {
    fail("Nepavyksta pasiekti Supabase Storage. Patikrinkite SUPABASE_URL ir serverio tinklo ryšį.", {
      errorCode: "upload_storage_unreachable",
      statusCode: 503,
    });
  }
}

function storageResponseError(operation: string, status: number): never {
  if (status === 401 || status === 403) {
    fail(`Supabase atmetė ${operation} užklausą (HTTP ${status}). Patikrinkite SUPABASE_SERVICE_ROLE_KEY ir projekto Storage teises.`, {
      errorCode: "upload_storage_forbidden",
      statusCode: 503,
    });
  }
  fail(`Supabase ${operation} nepavyko (HTTP ${status}). Patikrinkite Storage projekto būseną ir bandykite dar kartą.`, {
    errorCode: "upload_storage_request_failed",
    statusCode: 502,
  });
}

async function ensurePublicBucket(url: string, serviceRoleKey: string) {
  const headers = {
    ...authHeaders(serviceRoleKey),
    "Content-Type": "application/json",
  };
  const bucketConfig = {
    id: bucketName,
    name: bucketName,
    public: true,
    file_size_limit: maxImageSize,
    allowed_mime_types: allowedImageTypes,
  };
  const createResponse = await storageFetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers,
    body: JSON.stringify(bucketConfig),
  });

  if (createResponse.ok) return;
  if (createResponse.status !== 409) {
    storageResponseError("nuotraukų saugyklos paruošimas", createResponse.status);
  }

  const updateResponse = await storageFetch(`${url}/storage/v1/bucket/${bucketName}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      public: true,
      file_size_limit: maxImageSize,
      allowed_mime_types: allowedImageTypes,
    }),
  });
  if (!updateResponse.ok) {
    storageResponseError("nuotraukų saugyklos atnaujinimas", updateResponse.status);
  }
}

export const supabaseProductImageUploadProvider: FileUploadProvider = {
  id: "milishop-supabase-product-images",
  name: "Milishop Supabase product images",
  isConfigured: () => true,
  async upload({ data, mimeType }) {
    const { url, serviceRoleKey } = getSupabaseConfig();
    if (!mimeType || !allowedImageTypes.includes(mimeType)) {
      fail("Pasirinkite AVIF, GIF, HEIC, JPEG, PNG arba WebP nuotrauką.", {
        errorCode: "upload_image_unsupported_type",
        statusCode: 400,
      });
    }
    if (data.byteLength === 0 || data.byteLength > maxImageSize) {
      fail("Nuotraukos dydis turi būti nuo 1 baito iki 10 MB.", {
        errorCode: "upload_image_invalid_size",
        statusCode: 413,
      });
    }

    await ensurePublicBucket(url, serviceRoleKey);

    const objectName = crypto.randomUUID();
    const uploadResponse = await storageFetch(`${url}/storage/v1/object/${bucketName}/${objectName}`, {
      method: "POST",
      headers: {
        ...authHeaders(serviceRoleKey),
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "x-upsert": "false",
      },
      body: Uint8Array.from(data),
    });
    if (!uploadResponse.ok) {
      storageResponseError("nuotraukos įkėlimas", uploadResponse.status);
    }

    return {
      url: `${url}/storage/v1/object/public/${bucketName}/${objectName}`,
      provider: "milishop-supabase-product-images",
    };
  },
};