// ABOUTME: Bundles the browser-only plugin and local settings help for Obsidian.
// ABOUTME: The host supplies the sole external runtime module.
import { build } from "esbuild";
await build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: ["obsidian"],
  platform: "browser",
  format: "cjs",
  target: "es2022",
  loader: { ".md": "text" },
  outfile: "main.js",
  logLevel: "info",
});
