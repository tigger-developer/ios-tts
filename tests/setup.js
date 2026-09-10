// ABOUTME: Runs the existing pure-logic tests in macOS JavaScript for Automation.
// ABOUTME: Supplies inert host class names only; it does not simulate Obsidian.
globalThis.module = { exports: {} };
globalThis.require = function require(name) {
  if (name !== "obsidian") throw new Error(`Unexpected dependency: ${name}`);
  return {
    Plugin: class {},
    Component: class {},
    Modal: class {},
    PluginSettingTab: class {},
  };
};
const cases = [];
globalThis.test = function test(name, body) {
  cases.push({ name, body });
};
function same(actual, expected) {
  if (Object.is(actual, expected)) return true;
  if (
    !actual ||
    !expected ||
    typeof actual !== "object" ||
    typeof expected !== "object"
  )
    return false;
  if (Array.isArray(actual) !== Array.isArray(expected)) return false;
  const keys = Object.keys(actual);
  return (
    keys.length === Object.keys(expected).length &&
    keys.every(
      (key) =>
        Object.prototype.hasOwnProperty.call(expected, key) &&
        same(actual[key], expected[key]),
    )
  );
}
globalThis.assert = {
  equal(actual, expected, message = "Values differ") {
    if (!Object.is(actual, expected))
      throw new Error(`${message}: ${actual} !== ${expected}`);
  },
  deepEqual(actual, expected) {
    if (!same(actual, expected))
      throw new Error(
        `Values differ: ${JSON.stringify(actual)} !== ${JSON.stringify(expected)}`,
      );
  },
  fail(message) {
    throw new Error(message);
  },
};
