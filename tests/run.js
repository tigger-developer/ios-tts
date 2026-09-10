// ABOUTME: Executes registered behavioural tests and propagates failures to Make.
// ABOUTME: Missing asynchronous completion fails instead of reporting success.
let result;
let failure;
async function runCases() {
  let failed = 0;
  for (const { name, body } of cases) {
    try {
      await body();
      console.log(`PASS ${name}`);
    } catch (error) {
      failed++;
      console.log(`FAIL ${name}: ${error.message}`);
    }
  }
  if (failed || cases.length === 0)
    throw new Error(`${failed} failures in ${cases.length} tests`);
  result = `${cases.length}/${cases.length} tests passed`;
}
runCases().catch((error) => {
  failure = error;
});
globalThis.run = function run() {
  if (failure) throw failure;
  if (!result) throw new Error("Test execution did not finish");
  return result;
};
