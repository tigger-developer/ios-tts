// ABOUTME: Installs three artefacts into a prompted vault or explicit plugin directory.
// ABOUTME: Validates all targets first and preserves unrelated and identical files.
import { lstat, mkdir, readFile, realpath, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { isAbsolute, join } from "node:path";
import { createInterface } from "node:readline";
import { URL } from "node:url";

const files = ["main.js", "manifest.json", "styles.css"];

async function inspect(path) {
  try {
    return await lstat(path);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function promptRoot() {
  console.log("Disable Full Document Reader in Obsidian before installing.");
  const input = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    process.stdout.write("Obsidian vault root: ");
    for await (const line of input) {
      let root = line.trim();
      if (
        (root.startsWith('"') && root.endsWith('"')) ||
        (root.startsWith("'") && root.endsWith("'"))
      )
        root = root.slice(1, -1).trim();
      if (!root) break;
      return root.startsWith("~/") ? join(homedir(), root.slice(2)) : root;
    }
    throw new Error("Installation cancelled. Enter a vault root to install.");
  } finally {
    input.close();
  }
}

async function selectDestination() {
  const explicit = process.env.PLUGIN_DIR;
  const requested = explicit || (await promptRoot());
  if (!isAbsolute(requested))
    throw new Error("The installation path must be absolute.");
  const root = await realpath(requested);
  if (!(await lstat(root)).isDirectory())
    throw new Error(
      "The installation path must resolve to an existing directory.",
    );
  if (explicit) return { destination: root, missing: [] };

  const missing = [];
  let destination = root;
  for (const child of [".obsidian", "plugins", "ios-tts"]) {
    destination = join(destination, child);
    const info = await inspect(destination);
    if (info && !info.isDirectory())
      throw new Error(
        `${destination} must be a real directory. Existing files and symlinks are never replaced; select a vault with real plugin files for syncing.`,
      );
    if (!info) {
      if (child === ".obsidian")
        throw new Error(
          "The selected vault must already contain a .obsidian directory.",
        );
      missing.push(destination);
    }
  }
  return { destination, missing };
}

async function preflight(destination) {
  const artefacts = [];
  for (const name of files) {
    const target = join(destination, name);
    const info = await inspect(target);
    if (info && !info.isFile())
      throw new Error(
        `${name} must be absent or a regular file, never a symlink or directory.`,
      );
    const existing = info ? await readFile(target) : null;
    const source = await readFile(name);
    artefacts.push({ name, target, source, existing });
  }
  return artefacts;
}

async function showInformation() {
  const args = process.argv.slice(2);
  if (args.length === 0) return false;
  if (args.length === 1 && ["-h", "--help"].includes(args[0])) {
    console.log(
      "Usage: node scripts/install.mjs [--help | --version]\nBuild first with make build, or use make install.\nPrompts for an existing Obsidian vault root and installs to .obsidian/plugins/ios-tts/.\nPLUGIN_DIR selects an existing absolute plugin directory without prompting.\nDisable the plugin before installing. Settings and unrelated files are preserved.",
    );
  } else if (args.length === 1 && args[0] === "--version") {
    const manifest = JSON.parse(
      await readFile(new URL("../manifest.json", import.meta.url), "utf8"),
    );
    console.log(manifest.version);
  } else {
    console.error(
      "Invalid arguments. Use --help for installation instructions.",
    );
    process.exitCode = 2;
  }
  return true;
}

let copying = false;
try {
  if (!(await showInformation())) await install();
} catch (error) {
  console.error(`Installation failed: ${error.message}`);
  if (copying)
    console.error(
      "The installation may be partial. Keep the plugin disabled and retry before enabling it.",
    );
  process.exitCode = 1;
}

async function install() {
  const { destination, missing } = await selectDestination();
  const artefacts = await preflight(destination);
  for (const directory of missing) await mkdir(directory);
  if (destination === (await realpath(process.cwd()))) {
    console.log(
      "Build verified; the destination is this checkout. No copy needed.",
    );
  } else {
    copying = true;
    for (const { name, target, source, existing } of artefacts) {
      if (existing?.equals(source)) {
        console.log(`Unchanged: ${name}`);
        continue;
      }
      await writeFile(target, source);
      console.log(`Installed: ${name}`);
    }
  }
  console.log(
    `Plugin directory: ${destination}\nEnable Full Document Reader in Obsidian's Community plugins settings.`,
  );
}
