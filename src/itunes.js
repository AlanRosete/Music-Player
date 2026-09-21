// Cliente de la iTunes Search API.
// Es un endpoint público de Apple: no requiere cuenta, API key ni registro.
// Docs: https://performance-partners.apple.com/search-api
//
// Límite importante: los `previewUrl` son clips de 30 s. Apple no expone las
// pistas completas, así que no hay forma de reproducirlas enteras.

const ENDPOINT = 'https://itunes.apple.com/search';

/** Las portadas llegan en 100x100; la URL admite pedir un tamaño mayor. */
function upscaleArtwork(url, size = 600) {
  return url ? url.replace(/\/\d+x\d+bb\./, `/${size}x${size}bb.`) : '';
}

/** Normaliza un resultado de iTunes al mismo shape que usa el player. */
function toTrack(item) {
  return {
    id: String(item.trackId),
    name: item.trackName,
    artist: item.artistName,
    album: item.collectionName ?? '',
    cover: upscaleArtwork(item.artworkUrl100),
    src: item.previewUrl,
    genre: item.primaryGenreName ?? '',
    fullDuration: item.trackTimeMillis ? item.trackTimeMillis / 1000 : null,
    appleUrl: item.trackViewUrl ?? '',
  };
}

export async function searchTracks(term, { limit = 25, country = 'US', signal } = {}) {
  const params = new URLSearchParams({
    term,
    entity: 'song',
    media: 'music',
    limit: String(limit),
    country,
  });

  const res = await fetch(`${ENDPOINT}?${params}`, { signal });
  if (!res.ok) throw new Error(`iTunes respondió ${res.status}`);

  const data = await res.json();
  return (data.results ?? [])
    .filter((item) => item.previewUrl && item.trackName)
    .map(toTrack);
}

/**
 * Nota sobre "Top": Apple publica un feed de charts en
 * rss.applemarketingtools.com, pero ese endpoint no envía cabeceras CORS y el
 * navegador lo bloquea, así que no se puede consumir desde una página
 * estática. La Search API sí permite CORS, de modo que el top se aproxima
 * buscando artistas que enlazan en esas listas "COLLECTIONS".
 */

export const COLLECTIONS = [
  {
    id: 'top',
    label: 'Top',
    title: ['TOP', 'CHARTS'],
    terms: ['Ariana Grande', 'Rels B', 'Drake', 'KAROL G', 'Russ', 'Future'],
  },
  {
    id: 'latino',
    label: 'Latino',
    title: ['MÚSICA', 'LATINA'],
    terms: ['Bad Bunny', 'KAROL G', 'Feid', 'Peso Pluma', 'Rauw Alejandro'],
  },
  {
    id: 'indie',
    label: 'Indie',
    title: ['INDIE', 'ROOM'],
    terms: ['Tame Impala', 'Arctic Monkeys', 'Mac DeMarco', 'Beach House'],
  },
  {
    id: 'rnb',
    label: 'R&B',
    title: ['SMOOTH', 'R&B'],
    terms: ['Daniel Caesar', 'SZA', 'Frank Ocean', 'Kali Uchis', 'Brent Faiyaz'],
  },
];

/**
 * Arma una colección pidiendo varios artistas en paralelo y entrelazando los resultados
 */

export async function loadCollection(collection, { perTerm = 3, signal } = {}) {
  const groups = await Promise.all(
    collection.terms.map((term) =>
      searchTracks(term, { limit: perTerm, signal }).catch(() => []),
    ),
  );

  const interleaved = [];
  for (let i = 0; i < perTerm; i += 1) {
    for (const group of groups) {
      if (group[i]) interleaved.push(group[i]);
    }
  }

  const seen = new Set();
  return interleaved.filter((t) => {
    const key = `${t.name}::${t.artist}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
