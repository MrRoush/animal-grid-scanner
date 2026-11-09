import { ANIMALS } from "./animals.js";
import { fetchAnimalImage } from "./wiki.js";

const container = document.getElementById("animal-list");

async function loadPicture(animal, card, imageLink, image, message, articleLink) {
  try {
    const info = await fetchAnimalImage(animal.wiki);
    articleLink.href = info.page;
    if (!info.src) {
      message.textContent = "No picture available.";
    } else {
      image.src = info.src;
      image.hidden = false;
      imageLink.href = info.src;
      imageLink.setAttribute("aria-label", `View ${animal.name} picture`);
      message.remove();
    }
  } catch {
    message.textContent = "Picture could not be loaded.";
  } finally {
    card.dataset.loaded = "true";
  }
}

for (const animal of ANIMALS) {
  const card = document.createElement("figure");
  card.className = "animal-card";

  const imageLink = document.createElement("a");
  imageLink.className = "animal-image-link";
  imageLink.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(animal.wiki)}`;
  imageLink.target = "_blank";
  imageLink.rel = "noopener";
  imageLink.setAttribute("aria-label", `Open ${animal.name} Wikipedia article`);

  const image = Object.assign(document.createElement("img"), {
    alt: animal.name,
    loading: "lazy",
    hidden: true,
  });
  const message = Object.assign(document.createElement("span"), {
    textContent: "Loading picture…",
  });
  imageLink.append(image, message);

  const caption = document.createElement("figcaption");
  const name = Object.assign(document.createElement("strong"), { textContent: animal.name });
  const articleLink = Object.assign(document.createElement("a"), {
    href: `https://en.wikipedia.org/wiki/${encodeURIComponent(animal.wiki)}`,
    textContent: "Wikipedia article & picture credits",
    target: "_blank",
    rel: "noopener",
  });
  caption.append(name, document.createElement("br"), articleLink);
  card.append(imageLink, caption);
  container.append(card);

  const load = () => {
    if (card.dataset.loaded) return;
    loadPicture(animal, card, imageLink, image, message, articleLink);
  };
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        load();
      }
    });
    observer.observe(card);
  } else {
    load();
  }
}
