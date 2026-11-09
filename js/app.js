import { ANIMALS } from "./animals.js";
import { lumToBits, matchPattern, sampleGrid } from "./scanner.js";
import { fetchAnimalImage } from "./wiki.js";

const video = document.getElementById("video");
const guide = document.getElementById("guide");
const startBtn = document.getElementById("start");
const scanBtn = document.getElementById("scan");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const GUIDE_FRACTION = 0.6; // keep in sync with .guide size in style.css

function setStatus(text) {
  statusEl.textContent = text;
}

async function startCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    setStatus("Camera access needs HTTPS (or localhost) and a supported browser.");
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    });
    video.srcObject = stream;
    await video.play();
    guide.hidden = false;
    scanBtn.disabled = false;
    startBtn.hidden = true;
    setStatus("Hold the grid inside the square, then press Scan.");
  } catch (err) {
    setStatus(`Could not start the camera: ${err.message}`);
  }
}

function scan() {
  const w = video.videoWidth;
  const h = video.videoHeight;
  if (!w || !h) return;
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(video, 0, 0, w, h);

  const size = Math.floor(Math.min(w, h) * GUIDE_FRACTION);
  const x = Math.floor((w - size) / 2);
  const y = Math.floor((h - size) / 2);
  const lum = sampleGrid(ctx.getImageData(0, 0, w, h), x, y, size);

  const read = lumToBits(lum);
  if (!read) {
    showMessage("No grid found. Fill the square with the grid and improve the lighting.");
    return;
  }
  const match = matchPattern(read.bits, ANIMALS);
  if (!match) {
    showMessage(`Unknown pattern (${read.bits}). Try again.`);
    return;
  }
  showAnimal(match.animal, match.distance);
}

function showMessage(text) {
  resultEl.replaceChildren(Object.assign(document.createElement("p"), { textContent: text }));
}

async function showAnimal(animal, distance) {
  const title = Object.assign(document.createElement("h2"), { textContent: animal.name });
  const note = Object.assign(document.createElement("p"), {
    textContent: distance ? `Matched with ${distance} misread cell${distance > 1 ? "s" : ""}.` : "",
  });
  resultEl.replaceChildren(title, note);
  try {
    const info = await fetchAnimalImage(animal.wiki);
    if (!info.src) return;
    const img = Object.assign(document.createElement("img"), {
      src: info.src,
      alt: animal.name,
    });
    const credit = Object.assign(document.createElement("a"), {
      href: info.page,
      textContent: "Image from Wikipedia / Wikimedia Commons (see page for author and license)",
      target: "_blank",
      rel: "noopener",
    });
    resultEl.replaceChildren(title, note, img, credit);
  } catch {
    note.textContent += " (Could not load the image.)";
  }
}

startBtn.addEventListener("click", startCamera);
scanBtn.addEventListener("click", scan);
