// ABOUTME: Creates the requested synchronization checkpoint and transfers it.
// ABOUTME: Runs Git sequentially, stopping on failure without shell interpolation.
import { spawnSync } from "node:child_process";
function git(args, accepted = [0]) {
  const result = spawnSync("git", args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (!accepted.includes(result.status))
    throw new Error(
      `git ${args[0]} failed (${result.status ?? result.signal}).`,
    );
  return result.status;
}
try {
  git(["add", "-A"]);
  if (git(["diff", "--cached", "--quiet"], [0, 1]) === 1) {
    git(["commit", "-m", process.env.COMMIT_MESSAGE || "chore: sync"]);
  }
  git(["pull"]);
  git(["push"]);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
