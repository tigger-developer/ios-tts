// ABOUTME: Exercises word counting and preference persistence at owned boundaries.
// ABOUTME: RT003.2 checks limits and failures without simulating host widgets.

function settings(initial = null) {
  let stored = initial;
  let writes = 0;
  const preference = new ReaderSettings({
    load: () => Promise.resolve(stored),
    save: (value) => {
      stored = value;
      writes++;
      return Promise.resolve();
    },
  });
  return { preference, stored: () => stored, writes: () => writes };
}

void test("RT003.2 absent preferences default without a write; valid preferences reload", async () => {
  for (const raw of [null, undefined, {}]) {
    const h = settings(raw);
    assert.equal(await h.preference.load(), null);
    assert.equal(h.preference.maxWords, 100000);
    assert.equal(h.writes(), 0);
  }
  const h = settings({ maxWords: 42 });
  assert.equal(await h.preference.load(), null);
  assert.equal(h.preference.maxWords, 42);
  assert.equal(await h.preference.save(" 123 "), null);
  assert.deepEqual(h.stored(), { maxWords: 123 });
  const reloaded = settings(h.stored());
  await reloaded.preference.load();
  assert.equal(reloaded.preference.maxWords, 123);
});

void test("RT003.2 malformed and rejected loads default with an error and no rewrite", async () => {
  for (const raw of [
    [],
    "100",
    100,
    { maxWords: "100" },
    { maxWords: 0 },
    { maxWords: -1 },
    { maxWords: 1.5 },
    { maxWords: NaN },
    { maxWords: Infinity },
    { maxWords: Number.MAX_SAFE_INTEGER + 1 },
  ]) {
    const h = settings(raw);
    assert.equal(await h.preference.load(), "load");
    assert.equal(h.preference.maxWords, DEFAULT_MAX_WORDS);
    assert.equal(h.writes(), 0);
    assert.equal(h.stored(), raw);
  }
  const preference = new ReaderSettings({
    load: () => Promise.reject(new Error("unavailable")),
    save: () => {
      assert.fail("must not rewrite failed reads");
    },
  });
  assert.equal(await preference.load(), "load");
  assert.equal(preference.maxWords, DEFAULT_MAX_WORDS);
});

void test("RT003.2 invalid input preserves the active limit and storage", async () => {
  const h = settings({ maxWords: 20 });
  await h.preference.load();
  for (const raw of [
    "",
    " ",
    "0",
    "-1",
    "1.5",
    "hello",
    "1e3",
    "+2",
    "2x",
    "1 000",
    "9007199254740992",
  ]) {
    assert.equal(await h.preference.save(raw), "invalid", raw);
    assert.equal(h.preference.maxWords, 20);
    assert.equal(h.writes(), 0);
  }
  assert.equal(await h.preference.save("9007199254740991"), null);
  assert.equal(h.preference.maxWords, Number.MAX_SAFE_INTEGER);
});

void test("RT003.2 pending saves exclude overlaps; failure retains the limit and permits retry", async () => {
  let pending = deferred();
  const writes = [];
  const preference = new ReaderSettings({
    load: () => Promise.resolve({ maxWords: 3 }),
    save: (value) => {
      writes.push(value);
      return pending.promise;
    },
  });
  await preference.load();
  const first = preference.save("5");
  assert.equal(preference.saving, true);
  assert.equal(preference.maxWords, 3);
  assert.equal(await preference.save("7"), "busy");
  assert.deepEqual(writes, [{ maxWords: 5 }]);
  pending.reject(new Error("disk unavailable"));
  assert.equal(await first, "save");
  assert.equal(preference.maxWords, 3);
  assert.equal(preference.saving, false);
  pending = deferred();
  const retry = preference.save("5");
  pending.resolve();
  assert.equal(await retry, null);
  assert.equal(preference.maxWords, 5);
});

void test("RT003.2 counts source tokens at empty, markup and limit boundaries", () => {
  for (const source of ["", " \n\t", "one", "one\t two\nthree"]) {
    assert.equal(exceedsWordLimit(source, 3), false);
  }
  assert.equal(exceedsWordLimit("one two", 3), false);
  assert.equal(exceedsWordLimit("one two three four", 3), true);
  const markup = "---\ntitle: A\n---\n# Heading\n**text**"; // Seven source tokens.
  assert.equal(exceedsWordLimit(markup, 7), false);
  assert.equal(exceedsWordLimit(markup, 6), true);
  const long = "word ".repeat(100000);
  assert.equal(exceedsWordLimit(long, DEFAULT_MAX_WORDS), false);
  assert.equal(exceedsWordLimit(long + "end", DEFAULT_MAX_WORDS), true);
});

void test("RT003.2 saved limits affect the next invocation; refusal clears without rendering", async () => {
  const h = settings({ maxWords: 3 });
  await h.preference.load();
  let visible = null;
  const rendered = [];
  const notices = [];
  const reader = new ReaderSession({
    notice: (reason, max) => notices.push([reason, max]),
    create: () => {
      let source = "";
      return {
        render: (value) => {
          source = value;
          rendered.push(value);
          return Promise.resolve();
        },
        publish: () => {
          visible = source;
        },
        dispose: () => {
          visible = null;
        },
      };
    },
  });
  const snapshot = { source: "one two three", path: "note.md" };
  await reader.open(snapshot, h.preference.maxWords);
  await h.preference.save("2");
  assert.equal(visible, snapshot.source);
  await reader.open(snapshot, h.preference.maxWords);
  assert.equal(visible, null);
  assert.deepEqual(rendered, [snapshot.source]);
  assert.deepEqual(notices, [["limit", 2]]);
  await h.preference.save("3");
  await reader.open(snapshot, h.preference.maxWords);
  assert.equal(visible, snapshot.source);
  assert.deepEqual(rendered, [snapshot.source, snapshot.source]);
});
