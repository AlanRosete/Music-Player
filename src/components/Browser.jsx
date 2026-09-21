/** Buscador y pestañas de colección sobre el catálogo de iTunes. */
export function Browser({ catalog }) {
  const { collections, collection, query, setQuery, loadTop, status } = catalog;

  return (
    <div className="browser">
      <div className="browser__tabs" role="tablist" aria-label="Colecciones">
        {collections.map((c) => {
          const active = !query.trim() && c.id === collection.id;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`chip ${active ? 'is-active' : ''}`}
              onClick={() => loadTop(c)}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="browser__search">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar artista o canción…"
          aria-label="Buscar en iTunes"
          spellCheck="false"
        />
        {query && (
          <button type="button" className="browser__clear" onClick={() => loadTop()}
            aria-label="Limpiar búsqueda">
            ✕
          </button>
        )}
        {status === 'loading' && <span className="browser__spinner" aria-hidden="true" />}
      </div>
    </div>
  );
}
