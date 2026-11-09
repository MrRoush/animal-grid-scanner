import test from "node:test";
import assert from "node:assert/strict";
import { ANIMALS } from "../js/animals.js";
import { hamming, lumToBits, matchPattern } from "../js/scanner.js";

const rotate = (p) => {
  let out = "";
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) out += p[(3 - c) * 4 + r];
  return out;
};

test("patterns are valid and unique", () => {
  for (const a of ANIMALS) {
    assert.match(a.pattern, /^[01]{16}$/);
    const blackCells = [...a.pattern].filter((bit) => bit === "1").length;
    assert.ok(blackCells >= 4 && blackCells <= 12, `${a.name} has too little contrast`);
  }
  assert.equal(new Set(ANIMALS.map((a) => a.pattern)).size, ANIMALS.length);
});

test("patterns are at least 5 cells apart, including rotations", () => {
  for (const a of ANIMALS) {
    for (const b of ANIMALS) {
      if (a === b) continue;
      let p = b.pattern;
      for (let i = 0; i < 4; i++) {
        assert.ok(hamming(a.pattern, p) >= 5, `${a.name} vs ${b.name} (rot ${i})`);
        p = rotate(p);
      }
    }
  }
});

test("exact match", () => {
  const m = matchPattern(ANIMALS[2].pattern, ANIMALS);
  assert.equal(m.animal.name, ANIMALS[2].name);
  assert.equal(m.distance, 0);
});

test("has 35 animals with a wiki title each", () => {
  assert.equal(ANIMALS.length, 35);
  for (const a of ANIMALS) assert.ok(a.name && a.wiki, a.name);
});

test("inexact patterns resolve to the closest animal", () => {
  const flip = (s, i) => s.slice(0, i) + (s[i] === "1" ? "0" : "1") + s.slice(i + 1);
  for (const a of ANIMALS) {
    const m = matchPattern(flip(flip(a.pattern, 0), 7), ANIMALS);
    assert.equal(m.animal.name, a.name);
    assert.equal(m.distance, 2);
  }
  const far = flip(flip(flip(ANIMALS[0].pattern, 0), 7), 12);
  const m = matchPattern(far, ANIMALS);
  assert.ok(m);
  assert.equal(m.distance, Math.min(...ANIMALS.map((a) => hamming(far, a.pattern))));
});

test("lumToBits thresholds and rejects low contrast", () => {
  const lum = ANIMALS[1].pattern.split("").map((b) => (b === "1" ? 20 : 230));
  assert.equal(lumToBits(lum).bits, ANIMALS[1].pattern);
  assert.equal(lumToBits(new Array(16).fill(128)), null);
});
