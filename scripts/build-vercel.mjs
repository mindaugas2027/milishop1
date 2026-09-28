import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const agentNativeCli = fileURLToPath(
  new URL("../node_modules/@agent-native/core/bin/agent-native.js", import.meta.url),
);
const result = spawnSync(process.execPath, [agentNativeCli, "build"], {
  env: { ...process.env, NITRO_PRESET: "vercel" },
  stdio: "inherit",
});

process.exit(result.status ?? 1);