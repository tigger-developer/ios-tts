# ABOUTME: Installs maintained JavaScript and runs checks without Node or npm.
# ABOUTME: Installation and synchronization use argument-safe local scripts.
.PHONY: lint test install sync
export PLUGIN_DIR
export COMMIT_MESSAGE

lint:
	oxlint --deny-warnings main.js tests
	biome format main.js tests styles.css manifest.json --indent-style=space
	shellcheck scripts/install.sh scripts/sync.sh scripts/test.sh
	shfmt -d -i 2 scripts/install.sh scripts/sync.sh scripts/test.sh

test:
	bash scripts/test.sh

install:
	bash scripts/install.sh

sync:
	bash scripts/sync.sh
