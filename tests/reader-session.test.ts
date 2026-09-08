// ABOUTME: Exercises reader lifetime using controlled rendering and visible state.
// ABOUTME: RT003.1 proves replacement, cancellation and failure ownership.
import assert from "node:assert/strict";
import { test } from "node:test";
import { ReaderSession } from "../src/reader-session.ts";

function deferred() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

function harness() {
  let visible: string | null = null;
  const notices: string[] = [];
  const renders: Array<{
    source: string;
    path: string;
    resolve: () => void;
    reject: (error: Error) => void;
    released: boolean;
  }> = [];
  const reader = new ReaderSession({
    notice: (reason) => notices.push(reason),
    create: () => {
      const pending = deferred();
      const render = { source: "", path: "", ...pending, released: false };
      renders.push(render);
      return {
        render: (source, path) => {
          render.source = source;
          render.path = path;
          return pending.promise;
        },
        publish: () => {
          visible = render.source;
        },
        dispose: () => {
          render.released = true;
          if (visible === render.source) visible = null;
        },
      };
    },
  });
  return { reader, notices, renders, visible: () => visible };
}

void test("RT003.1 publishes the complete snapshot and releases it on close", async () => {
  const h = harness();
  const source = "# First\n\nMiddle **text**\n\nLast.";
  const opening = h.reader.open({ source, path: "folder/note.md" }, 100);
  assert.equal(h.visible(), null);
  assert.equal(h.renders[0]?.source, source);
  assert.equal(h.renders[0]?.path, "folder/note.md");
  h.renders[0].resolve();
  await opening;
  assert.equal(h.visible(), source);
  h.reader.close();
  h.reader.close();
  assert.equal(h.visible(), null);
  assert.equal(h.renders[0]?.released, true);
  assert.deepEqual(h.notices, []);
});

for (const late of ["success", "failure"] as const) {
  void test(`RT003.1 superseded ${late} cannot replace the newer reader`, async () => {
    const h = harness();
    const first = h.reader.open({ source: "A", path: "a.md" }, 100);
    const second = h.reader.open({ source: "B", path: "b.md" }, 100);
    assert.equal(h.renders[0]?.released, true);
    h.renders[1]!.resolve();
    await second;
    if (late === "success") h.renders[0].resolve();
    else h.renders[0].reject(new Error("private note detail"));
    await first;
    assert.equal(h.visible(), "B");
    assert.deepEqual(h.notices, []);
    assert.equal(h.renders[1]?.released, false);
  });
}

void test("RT003.1 closing preparation prevents later publication", async () => {
  const h = harness();
  const opening = h.reader.open({ source: "A", path: "a.md" }, 100);
  h.reader.close();
  assert.equal(h.renders[0]?.released, true);
  h.renders[0].resolve();
  await opening;
  assert.equal(h.visible(), null);
  assert.deepEqual(h.notices, []);
});

void test("RT003.1 rejection clears presentation and reports only a failure category", async () => {
  const h = harness();
  const opening = h.reader.open({ source: "private", path: "private.md" }, 100);
  assert.equal(h.renders.length, 1);
  h.renders[0]!.reject(new Error("private note detail"));
  await opening;
  assert.equal(h.visible(), null);
  assert.equal(h.renders[0]?.released, true);
  assert.deepEqual(h.notices, ["render"]);
});

void test("RT003.1 unsupported input clears a prior successful reader without rendering", async () => {
  const h = harness();
  const opening = h.reader.open({ source: "A", path: "a.md" }, 100);
  assert.equal(h.renders.length, 1);
  h.renders[0]!.resolve();
  await opening;
  await h.reader.open(null, 100);
  assert.equal(h.visible(), null);
  assert.equal(h.renders.length, 1);
  assert.equal(h.renders[0]?.released, true);
  assert.deepEqual(h.notices, ["unsupported"]);
});
