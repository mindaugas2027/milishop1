const maxImageBytes = 4 * 1024 * 1024;

export async function uploadProductImage(file: File) {
  if (file.size === 0 || file.size > maxImageBytes) {
    throw new Error("Nuotrauka turi būti ne didesnė nei 4 MB.");
  }

  const body = new FormData();
  body.append("image", file);
  const response = await fetch("/api/admin/product-image", {
    method: "POST",
    credentials: "same-origin",
    body,
  });
  const result = await response.json().catch(() => null) as { src?: unknown; provider?: unknown; message?: unknown; statusMessage?: unknown } | null;

  if (!response.ok) {
    const message = typeof result?.message === "string"
      ? result.message
      : typeof result?.statusMessage === "string"
        ? result.statusMessage
        : "Nuotraukos įkelti nepavyko. Patikrinkite Supabase Storage nustatymus.";
    throw new Error(message);
  }
  if (typeof result?.src !== "string" || !result.src) {
    throw new Error("Serveris negrąžino įkeltos nuotraukos nuorodos.");
  }

  const alt = file.name.replace(/\.[^./\\]+$/, "");
  return {
    src: result.src,
    alt,
    provider: typeof result.provider === "string" ? result.provider : "supabase",
  };
}