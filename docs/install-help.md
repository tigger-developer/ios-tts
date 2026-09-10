# Install Full Document Reader

Run `make install` from the checkout. No compilation, Node or npm is required.
The installer asks for an existing **Obsidian vault root**, then copies
`main.js`, `manifest.json` and `styles.css` into `.obsidian/plugins/ios-tts/`.

Disable the plugin before installing. The vault must contain a real `.obsidian`
directory. Missing plugin directories are created. Enter an absolute path,
including spaces without escaping, or `~/notes`. Matching surrounding quotes
are accepted. Blank input, EOF or Ctrl-C cancels without copying.

Settings and unrelated files are preserved; identical files are not rewritten.
Symlinked configuration/plugin directories are refused in the prompt flow.
Symlinks or directories at individual destination file paths are always refused.
After a copy failure, keep the plugin disabled and retry.

For an existing absolute plugin directory, including a deliberately selected
directory symlink, use `make install PLUGIN_DIR=/absolute/plugin/directory`.
This route neither prompts nor creates directories. A link to this checkout
requires no copy. The installer never changes Obsidian's enabled-plugin list.

`scripts/install.sh` accepts `-h`, `--help` and `--version` without installing.
