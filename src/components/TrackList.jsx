import { formatTime } from '../hooks/usePlayer.js';

function Skeleton() {
  return (
    <ul className="tracklist__items" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <li key={i}>
          <div className="track track--skeleton">
            <span className="track__index">{String(i + 1).padStart(2, '0')}</span>
            <span className="track__cover sk" />
            <span className="track__meta">
              <span className="sk sk--line" style={{ width: `${55 + ((i * 13) % 35)}%` }} />
              <span className="sk sk--line sk--sm" style={{ width: `${30 + ((i * 7) % 25)}%` }} />
            </span>
            <span className="sk sk--time" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function TrackList({ catalog, currentIndex, isPlaying, onSelect }) {
  const { tracks, status, error, retry, query, collection } = catalog;

  const heading = query.trim() ? `Resultados · ${query.trim()}` : collection.label;

  return (
    <section className="tracklist">
      <h2 className="tracklist__title">{heading}</h2>

      {status === 'loading' && <Skeleton />}

      {status === 'error' && (
        <div className="tracklist__state">
          <p>{error}</p>
          <button type="button" className="tracklist__retry" onClick={retry}>
            Reintentar
          </button>
        </div>
      )}

      {status === 'empty' && (
        <div className="tracklist__state">
          <p>Sin resultados para “{query.trim()}”.</p>
        </div>
      )}

      {status === 'ready' && (
        <ul className="tracklist__items">
          {tracks.map((track, i) => {
            const active = i === currentIndex;
            return (
              <li key={track.id}>
                <button
                  type="button"
                  className={`track ${active ? 'is-active' : ''}`}
                  onClick={() => onSelect(i)}
                  aria-current={active ? 'true' : undefined}
                >
                  <span className="track__index">{String(i + 1).padStart(2, '0')}</span>

                  <span className="track__cover">
                    <img src={track.cover} alt="" loading="lazy" />
                    {active && isPlaying && (
                      <span className="track__eq" aria-hidden="true">
                        <i /><i /><i />
                      </span>
                    )}
                  </span>

                  <span className="track__meta">
                    <span className="track__name">{track.name}</span>
                    <span className="track__album">{track.artist}</span>
                  </span>

                  {/* Duración de la canción completa; el preview dura 30 s. */}
                  <span className="track__time">
                    {track.fullDuration ? formatTime(track.fullDuration) : '—:—'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
