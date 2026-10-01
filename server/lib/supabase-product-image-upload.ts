import type { FileUploadProvider } from "@agent-native/core/file-upload";

const bucketName = "product-images";
const maxImageSize = 10 * 1024 * 1024;
const allowedImageTypes = ["image/avif", "image/gif", "image/heic", "image/heif", "image/jpeg", "image/png", "image/webp"];

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/+$/, ""); // guard:allow-env-credential — Supabase project URL is deploy-scoped storage configuration.
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(); // guard:allow-env-credential — service-role key is a deploy-scoped server secret for Supabase Storage.
  if (!url || !serviceRoleKey) {
    throw new Error("Nuotraukų saugykla nesukonfigūruota. Serverio aplinkoje trūksta SUPABASE_URL arba SUPABASE_SERVICE_ROLE_KEY.");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("Supabase nuotraukų saugyklos URL yra netinkamas.");
  }
  if (parsedUrl.protocol !== "https:" && process.env.NODE_ENV === "production") {
    throw new Error("Produkcijoje Supabase URL turi naudoti HTTPS.");
  }

  return { url: parsedUrl.origin, serviceRoleKey };
}

function authHeaders(serviceRoleKey: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  };
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
  const createResponse = await fetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers,
    body: JSON.stringify(bucketConfig),
  });

  if (createResponse.ok) return;
  if (createResponse.status !== 409) {
    throw new Error(`Supabase nuotraukų saugyklos paruošti nepavyko (HTTP ${createResponse.status}).`);
  }

  const updateResponse = await fetch(`${url}/storage/v1/bucket/${bucketName}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      public: true,
      file_size_limit: maxImageSize,
      allowed_mime_types: allowedImageTypes,
    }),
  });
  if (!updateResponse.ok) {
    throw new Error(`Supabase nuotraukų saugyklos paruošti nepavyko (HTTP ${updateResponse.status}).`);
  }
}

export const supabaseProductImageUploadProvider: FileUploadProvider = {
  id: "milishop-supabase-product-images",
  name: "Milishop Supabase product images",
  isConfigured: () => true,
  async upload({ data, mimeType }) {
    const { url, serviceRoleKey } = getSupabaseConfig();
    if (!mimeType || !allowedImageTypes.includes(mimeType)) {
      throw new Error("Palaikomi tik AVIF, GIF, HEIC, JPEG, PNG ir WebP vaizdai.");
    }
    if (data.byteLength === 0 || data.byteLength > maxImageSize) {
      throw new Error("Nuotrauka turi būti nuo 1 baito iki 10 MB.");
    }

    await ensurePublicBucket(url, serviceRoleKey);

    const objectName = crypto.randomUUID();
    const uploadResponse = await fetch(`${url}/storage/v1/object/${bucketName}/${objectName}`, {
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
      throw new Error(`Supabase nuotraukos įkelti nepavyko (HTTP ${uploadResponse.status}).`);
    }

    return {
      url: `${url}/storage/v1/object/public/${bucketName}/${objectName}`,
      provider: "milishop-supabase-product-images",
    };
  },
};