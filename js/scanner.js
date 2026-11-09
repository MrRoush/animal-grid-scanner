export const GRID_SIZE = 4;
const MIN_CONTRAST = 50; // below this, the frame likely has no black/white grid

export function hamming(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

// Returns { bits, contrast } or null when there isn't enough contrast.
// `lum` is an array of 16 average luminance values, row-major.
export function lumToBits(lum) {
  const min = Math.min(...lum);
  const max = Math.max(...lum);
  const contrast = max - min;
  if (contrast < MIN_CONTRAST) return null;
  const threshold = (min + max) / 2;
  return { bits: lum.map((v) => (v < threshold ? "1" : "0")).join(""), contrast };
}

// Always returns the closest animal as { animal, distance } (distance 0 is an
// exact match), or null if `animals` is empty. Ties go to the first listed.
export function matchPattern(bits, animals) {
  let best = null;
  for (const animal of animals) {
    const distance = hamming(bits, animal.pattern);
    if (!best || distance < best.distance) best = { animal, distance };
  }
  return best;
}

// Samples the centre of each cell inside the square (x, y, size) of the frame.
export function sampleGrid(imageData, x, y, size) {
  const { data, width } = imageData;
  const cell = size / GRID_SIZE;
  const inset = cell * 0.25; // only read the middle half of each cell
  const lum = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const x0 = Math.floor(x + c * cell + inset);
      const x1 = Math.ceil(x + (c + 1) * cell - inset);
      const y0 = Math.floor(y + r * cell + inset);
      const y1 = Math.ceil(y + (r + 1) * cell - inset);
      let sum = 0;
      let n = 0;
      for (let py = y0; py < y1; py++) {
        for (let px = x0; px < x1; px++) {
          const i = (py * width + px) * 4;
          sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          n++;
        }
      }
      lum.push(n ? sum / n : 255);
    }
  }
  return lum;
}
