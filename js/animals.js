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
  { name: "Zebra", wiki: "Zebra", pattern: "1010001000011000" },
  { name: "Kangaroo", wiki: "Kangaroo", pattern: "0111110011001111" },
  { name: "Koala", wiki: "Koala", pattern: "1011001001001110" },
  { name: "Wolf", wiki: "Wolf", pattern: "1101100001001000" },
  { name: "Polar Bear", wiki: "Polar_bear", pattern: "0111011110000101" },
  { name: "Horse", wiki: "Horse", pattern: "0011010100110111" },
  { name: "Dolphin", wiki: "Dolphin", pattern: "1011001111110010" },
  { name: "Gorilla", wiki: "Gorilla", pattern: "1000011110101011" },
];
