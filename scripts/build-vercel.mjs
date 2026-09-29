import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const agentNativeCli = fileURLToPath(
  new URL("../node_modules/@agent-native/core/bin/agent-native.js", import.meta.url),
);

function runPnpm(args) {
  const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  const migration = spawnSync(command, args, {
    env: process.env,
    shell: process.platform === "win32",
    stdio: "inherit",
  });

  if (migration.error) {
    console.error(migration.error.message);
    process.exit(1);
  }

  if (migration.status !== 0) {
    process.exit(migration.status ?? 1);
  }
}

if (process.env.VERCEL_ENV === "production") {
  if (!process.env.DATABASE_URL_UNPOOLED) {
    console.error("DATABASE_URL_UNPOOLED is required for production migrations.");
    process.exit(1);
  }

  runPnpm(["run", "migrate:production"]);
  runPnpm(["run", "db:migrate"]);
}

const result = spawnSync(process.execPath, [agentNativeCli, "build"], {
  env: { ...process.env, NITRO_PRESET: "vercel" },
  stdio: "inherit",
});

process.exit(result.status ?? 1);