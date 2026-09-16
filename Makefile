# ABOUTME: Installs maintained JavaScript and runs checks without Node or npm.
# ABOUTME: Installation, release and synchronization use argument-safe local scripts.
.PHONY: lint test install release sync
export PLUGIN_DIR
export COMMIT_MESSAGE
export VERSION

lint:
	oxlint --deny-warnings main.js tests
	biome format main.js tests styles.css manifest.json --indent-style=space
	shellcheck scripts/install.sh scripts/release.sh scripts/sync.sh scripts/test.sh
	shfmt -d -i 2 scripts/install.sh scripts/release.sh scripts/sync.sh scripts/test.sh

test:
	bash scripts/test.sh

install:
	bash scripts/install.sh

# VERSION=x.y.z releases that exact version instead of the next patch.
release: lint test
	bash scripts/release.sh

sync:
	bash scripts/sync.sh
