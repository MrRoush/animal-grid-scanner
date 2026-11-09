import { ANIMALS } from "./animals.js";

const container = document.getElementById("grids");
const select = document.getElementById("cell-size");

function setCellSize(cm) {
  container.style.setProperty("--cell", `${cm}cm`);
}

const saved = new URLSearchParams(location.search).get("cell");
if ([...select.options].some((o) => o.value === saved)) select.value = saved;
setCellSize(select.value);
select.addEventListener("change", () => {
  setCellSize(select.value);
  history.replaceState(null, "", `?cell=${select.value}`);
});

for (const animal of ANIMALS) {
  const figure = document.createElement("figure");
  const grid = document.createElement("div");
  grid.className = "print-grid";
  for (const bit of animal.pattern) {
    const cell = document.createElement("div");
    cell.className = bit === "1" ? "cell black" : "cell";
    grid.append(cell);
  }
  const caption = Object.assign(document.createElement("figcaption"), {
    textContent: animal.name,
  });
  figure.append(grid, caption);
  container.append(figure);
}
