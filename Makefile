# ABOUTME: Provides build, validation and explicit installation commands.
# ABOUTME: Installation and synchronization use argument-safe local scripts.
.PHONY: build lint test vulncheck install sync
export PLUGIN_DIR
export COMMIT_MESSAGE

build:
	npm run build

lint:
	npm run lint

test:
	npm test

vulncheck:
	npm audit --package-lock-only --include=dev

install: build
	node scripts/install.mjs

sync:
	node scripts/sync.mjs
