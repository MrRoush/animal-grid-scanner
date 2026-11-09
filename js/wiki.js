// Fetches the lead image of a Wikipedia article (hosted on Wikimedia).
const cache = new Map();

// Fallback when the summary has no image: ask the MediaWiki API for the page image.
async function fetchPageImage(title) {
  const url =
    "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=original|thumbnail" +
    `&pithumbsize=800&redirects=1&format=json&origin=*&titles=${encodeURIComponent(title)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Wikipedia returned ${res.status}`);
  const pages = Object.values((await res.json()).query?.pages ?? {});
  return pages[0]?.original?.source ?? pages[0]?.thumbnail?.source ?? null;
}

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
        .then(async (data) => ({
          src:
            data.originalimage?.source ??
            data.thumbnail?.source ??
            (await fetchPageImage(title).catch(() => null)),
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
