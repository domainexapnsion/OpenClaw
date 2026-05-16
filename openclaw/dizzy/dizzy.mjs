#!/usr/bin/env node
console.log("Dizzy booting...");
import { createJiti } from "jiti";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log("__dirname:", __dirname);

const jiti = createJiti(import.meta.url, {
  interopDefault: true,
  fsCache: false,
  alias: {
    "dizzy/extension-api": path.resolve(__dirname, "src/extensionAPI.ts"),
    "dizzy/plugin-sdk": path.resolve(__dirname, "src/plugin-sdk/index.ts"),
    "dizzy/plugin-sdk/(.*)": path.resolve(__dirname, "src/plugin-sdk/$1.ts"),
    "@dizzy/plugin-sdk": path.resolve(__dirname, "src/plugin-sdk/index.ts"),
    "@dizzy/(.*)": path.resolve(__dirname, "extensions/$1")
  }
});
console.log("Jiti initialized. Importing index.ts...");
const mod = await jiti.import(path.resolve(__dirname, "src/index.ts"));
console.log("index.ts imported.");
// Force run the CLI entry
if (mod.runLegacyCliEntry) {
  console.log("Running CLI entry...");
  await mod.runLegacyCliEntry(process.argv).catch(err => {
    console.error("CLI Entry Error:", err);
    process.exit(1);
  });
} else {
  console.error("runLegacyCliEntry not found in module.");
}
