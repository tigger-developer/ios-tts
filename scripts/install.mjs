// ABOUTME: Copies exactly three artefacts to an explicit existing plugin directory.
// ABOUTME: Validates all targets first and preserves unrelated and identical files.
import { lstat, readFile, realpath, writeFile } from "node:fs/promises";
import { isAbsolute, join } from "node:path";
const files = ["main.js", "manifest.json", "styles.css"];
let copying = false;
try {
  const requested = process.env.PLUGIN_DIR;
  if (!requested || !isAbsolute(requested))
    throw new Error("Set PLUGIN_DIR to an absolute existing plugin directory.");
  const destination = await realpath(requested);
  if (!(await lstat(destination)).isDirectory())
    throw new Error("PLUGIN_DIR must resolve to a directory.");
  const artefacts = [];
  for (const name of files) {
    const target = join(destination, name);
    let existing = null;
    try {
      const info = await lstat(target);
      if (!info.isFile() || info.isSymbolicLink())
        throw new Error(
          `${name} must be absent or a regular file, never a symlink or directory.`,
        );
      existing = await readFile(target);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    const source = await readFile(name);
    artefacts.push({ name, target, source, existing });
  }
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
} catch (error) {
  console.error(`Installation failed: ${error.message}`);
  if (copying)
    console.error(
      "The installation may be partial. Keep the plugin disabled and retry before enabling it.",
    );
  process.exitCode = 1;
}
