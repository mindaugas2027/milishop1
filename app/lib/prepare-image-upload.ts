const maxActionImageBytes = 2 * 1024 * 1024;
const maxImageEdge = 1800;

function canvasToWebp(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Nepavyko paruošti nuotraukos įkėlimui."));
    }, "image/webp", quality);
  });
}

export async function prepareImageUpload(file: File) {
  if (file.size <= maxActionImageBytes) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Šio formato nuotraukos nepavyko sumažinti. Pasirinkite JPEG, PNG arba WebP iki 2 MB.");
  }

  try {
    const scale = Math.min(1, maxImageEdge / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Nepavyko paruošti nuotraukos įkėlimui.");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    for (const quality of [0.82, 0.68, 0.54]) {
      const blob = await canvasToWebp(canvas, quality);
      if (blob.size <= maxActionImageBytes) {
        const name = file.name.replace(/\.[^.]+$/, "") || "product-image";
        return new File([blob], `${name}.webp`, { type: "image/webp", lastModified: file.lastModified });
      }
    }
    throw new Error("Nuotrauka per didelė įkelti. Pasirinkite mažesnį failą.");
  } finally {
    bitmap.close();
  }
}