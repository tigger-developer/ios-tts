# Synchronize the checkout

`make sync` stages the whole working tree, commits staged changes, then runs
`git pull` and `git push` using the existing upstream and pull configuration.
It stops on the first failure. The default commit message is `chore: sync`;
`COMMIT_MESSAGE` overrides it. This command includes all current edits.

`scripts/sync.sh` accepts `-h`, `--help` and `--version` without changing Git state.
