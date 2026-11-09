// Patterns are 16 characters, row-major (left-to-right, top-to-bottom).
// "1" = black cell, "0" = white cell.
// Keep every pair at least 5 cells apart (also when rotated) so a misread
// cell or two still resolves to the right animal. Run `npm test` after editing.
export const ANIMALS = [
  { name: "Cat", wiki: "Cat", pattern: "0101111101010110" },
  { name: "Dog", wiki: "Dog", pattern: "0000011001101100" },
  { name: "Lion", wiki: "Lion", pattern: "1100010001001101" },
  { name: "Elephant", wiki: "Elephant", pattern: "0011101010000010" },
  { name: "Giraffe", wiki: "Giraffe", pattern: "0110001101010111" },
  { name: "Penguin", wiki: "Penguin", pattern: "0100010110101000" },
  { name: "Tiger", wiki: "Tiger", pattern: "1010010000011111" },
  { name: "Panda", wiki: "Giant_panda", pattern: "0110011010010110" },
];
