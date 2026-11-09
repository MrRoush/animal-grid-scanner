# Animal Grid Scanner

A QR-code-style demo: point your webcam at a printed 4×4 black-and-white grid and the app shows the matching animal with an image from Wikipedia/Wikimedia Commons. Everything runs in the browser; camera frames are never uploaded.

## How it works

- Each cell is one bit (black = 1, white = 0), read row by row, giving a 16-bit pattern.
- A 4×4 grid has 65,536 possible patterns. `js/animals.js` maps 35 of them to animals. Patterns differ by at least 5 cells (also when rotated), so the closest-pattern scanner can still resolve up to two misread cells.
- The user aligns the grid inside the on-screen square and presses **Scan**. `js/scanner.js` averages the centre of each cell, thresholds at the midpoint between the darkest and lightest cell, and matches.
- Images come from the Wikipedia REST summary API (`js/wiki.js`), with a link back to the article for author and license details.
- Open `animals.html` to browse the animals and their linked pictures; images load as you scroll.

## Run locally

```sh
npm start        # serves http://localhost:8000
npm test         # runs the matching tests
```

Camera access requires HTTPS or `localhost`. Open `print.html` to print the grids at a true physical size (pick 1.5–4 cm squares; print at 100%, 2 cm is a good default).

## Deploy to GitHub Pages

Settings → Pages → Deploy from a branch → `main` / `(root)`. The site is served over HTTPS, so the camera works.

## Roadmap

- Automatic grid detection and rotation handling
- Continuous scanning instead of a Scan button
- Add a border/marker to the printed grids for easier detection
- Even more animals (keep patterns ≥ 5 cells apart; `npm test` checks this)
