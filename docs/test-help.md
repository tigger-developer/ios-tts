# Reader regression tests

Run `make test` on macOS. No Node, npm or downloaded test framework is required.
`scripts/test.sh` also accepts `-h`, `--help` and `--version`.

The script executes the maintained plugin and the existing session and word-limit
tests in macOS JavaScript for Automation. Inert Obsidian class names allow the
file to load; no host UI is instantiated or simulated. Assertions exercise the
same pure logic used by the plugin. Native rendering and speech remain user tests.
