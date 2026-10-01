import { registerFileUploadProvider } from "@agent-native/core/file-upload";
import { defineNitroPlugin } from "@agent-native/core/server";

import { supabaseProductImageUploadProvider } from "../lib/supabase-product-image-upload.js";

export default defineNitroPlugin(() => {
  registerFileUploadProvider(supabaseProductImageUploadProvider);
});