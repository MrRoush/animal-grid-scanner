// Fetches the lead image of a Wikipedia article (hosted on Wikimedia).
const cache = new Map();

export function fetchAnimalImage(title) {
  if (!cache.has(title)) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    cache.set(
      title,
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`Wikipedia returned ${res.status}`);
          return res.json();
        })
        .then((data) => ({
          src: data.originalimage?.source ?? data.thumbnail?.source ?? null,
          page: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${title}`,
          description: data.extract ?? "",
        }))
        .catch((err) => {
          cache.delete(title);
          throw err;
        }),
    );
  }
  return cache.get(title);
}
