import { useEffect, useState } from 'react';
import { formatTime } from '../hooks/usePlayer.js';

/**
 * Las duraciones se leen de los metadatos
 * de cada archivo una sola vez al montar.
 */
function useDurations(tracks) {
  const [durations, setDurations] = useState({});

  useEffect(() => {
    let cancelled = false;
    const probes = tracks.map((track) => {
      const audio = new Audio();
      audio.preload = 'metadata';
      const onMeta = () => {
        if (cancelled) return;
        setDurations((d) => ({ ...d, [track.id]: audio.duration }));
      };
      audio.addEventListener('loadedmetadata', onMeta);
      audio.src = track.src;
      return { audio, onMeta };
    });

    return () => {
      cancelled = true;
      probes.forEach(({ audio, onMeta }) => {
        audio.removeEventListener('loadedmetadata', onMeta);
        audio.src = '';
      });
    };
  }, [tracks]);

  return durations;
}

export function TrackList({ tracks, currentIndex, isPlaying, onSelect }) {
  const durations = useDurations(tracks);

  return (
    <section className="tracklist">
      <h2 className="tracklist__title">Popular</h2>
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
                  <span className="track__album">{track.album ?? track.artist}</span>
                </span>

                <span className="track__time">
                  {durations[track.id] ? formatTime(durations[track.id]) : '—:—'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
