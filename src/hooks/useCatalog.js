import { useCallback, useEffect, useRef, useState } from 'react';
import { COLLECTIONS, loadCollection, searchTracks } from '../itunes.js';

/**
 * Catálogo remoto: colecciones curadas y búsqueda libre sobre iTunes.
 */

export function useCatalog() {
  const [collection, setCollection] = useState(COLLECTIONS[0]);
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error | empty
  const [error, setError] = useState('');

  // Cancela la petición anterior cuando llega una nueva.
  const abortRef = useRef(null);

  const run = useCallback(async (fetcher) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');
    setError('');

    try {
      const result = await fetcher(controller.signal);
      if (controller.signal.aborted) return;
      setTracks(result);
      setStatus(result.length ? 'ready' : 'empty');
    } catch (e) {
      if (e.name === 'AbortError') return;
      setError(
        navigator.onLine
          ? 'No se pudo conectar con iTunes.'
          : 'Sin conexión a internet.',
      );
      setStatus('error');
    }
  }, []);

  const loadTop = useCallback(
    (target) => {
      const next = target ?? collection;
      setCollection(next);
      setQuery('');
      return run((signal) => loadCollection(next, { signal }));
    },
    [collection, run],
  );

  // Carga inicial.
  useEffect(() => {
    run((signal) => loadCollection(COLLECTIONS[0], { signal }));
  }, [run]);

  useEffect(() => {
    const term = query.trim();
    if (!term) return undefined;

    const timer = setTimeout(() => {
      run((signal) => searchTracks(term, { limit: 30, signal }));
    }, 450);

    return () => clearTimeout(timer);
  }, [query, run]);

  useEffect(() => () => abortRef.current?.abort(), []);

  return {
    collections: COLLECTIONS,
    collection,
    query,
    setQuery,
    tracks,
    status,
    error,
    loadTop,
    retry: () => (query.trim()
      ? run((signal) => searchTracks(query.trim(), { limit: 25, signal }))
      : loadTop()),
  };
}
