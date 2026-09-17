// Guards the bug that hung `next build` forever: fillAndShuffle's loop only
// grew `out` inside the dedup branch, so it never terminated.
// Run: node tests/test-fill-and-shuffle.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../components/DraggableGrid.tsx", import.meta.url), "utf8");
const body = src.slice(src.indexOf("function mulberry32"), src.indexOf("function GridCell"));
// Strip the TS-only bits so the real source runs as plain JS — keeps the test
// honest about the shipped code instead of a copy that can drift.
const js = body.replace(/<T>|: T\[\]|: number|: T\b/g, "").replace(/!(?=[\s;,)\]])/g, "");
const fillAndShuffle = new Function(`${js}; return fillAndShuffle;`)();

// Terminates and returns exactly `target` items, including the degenerate cases
// that used to spin: a single item, and target smaller than the pool.
for (const [items, target] of [
  [["a"], 9],
  [["a", "b"], 16],
  [["a", "b", "c", "d"], 4],
  [["a", "b", "c"], 1],
  [Array.from({ length: 12 }, (_, i) => `p${i}`), 25],
]) {
  const out = fillAndShuffle(items, target, 0xc0ffee);
  assert.equal(out.length, target, `expected ${target} items for pool of ${items.length}`);
  assert.ok(out.every((x) => items.includes(x)), "only pool items come out");
}

assert.deepEqual(fillAndShuffle([], 10, 1), [], "empty pool stays empty");

// Deterministic for a given seed, so the grid does not reshuffle on rerender.
const a = fillAndShuffle(["a", "b", "c"], 9, 42);
const b = fillAndShuffle(["a", "b", "c"], 9, 42);
assert.deepEqual(a, b, "same seed gives same order");

console.log("fillAndShuffle: ok");
