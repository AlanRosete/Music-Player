import { usePlayer } from './hooks/usePlayer.js';
import { useCatalog } from './hooks/useCatalog.js';
import { Vinyl } from './components/Vinyl.jsx';
import { TrackList } from './components/TrackList.jsx';
import { Controls } from './components/Controls.jsx';
import { Browser } from './components/Browser.jsx';

export default function App() {
  const catalog = useCatalog();
  const player = usePlayer(catalog.tracks);
  const {
    track, index, isPlaying, progress, duration, seek, selectTrack, setIsSeeking, loadError,
  } = player;

  const title = catalog.query.trim()
    ? ['SEARCH', 'RESULTS']
    : catalog.collection.title;

  return (
    <div className="shell">
      <header className="masthead">
        <h1 className="masthead__brand">Saviom</h1>
        <p className="masthead__tagline">Music Streaming</p>
      </header>

      <main className="stage">
        <nav className="stage__nav">
          <span className="stage__logo">S/M</span>
          <Browser catalog={catalog} />
        </nav>

        <div className="stage__body">
          <div className="stage__left">
            <Vinyl
              track={track}
              isPlaying={isPlaying}
              progress={progress}
              duration={duration}
              onSeek={seek}
              onSeekStart={() => setIsSeeking(true)}
              onSeekEnd={() => setIsSeeking(false)}
            />
          </div>

          <div className="stage__right">
            <section className="feature">
              <h2 className="feature__title">
                {title.map((line) => (
                  <span key={line} className="feature__line">{line}</span>
                ))}
              </h2>
              <p className="feature__genres">
                {track ? `${track.genre || 'Music'} · vista previa de 30 s` : 'iTunes Search API'}
              </p>
            </section>

            <TrackList
              catalog={catalog}
              currentIndex={index}
              isPlaying={isPlaying}
              onSelect={selectTrack}
            />

            {loadError && (
              <p className="stage__error" role="alert">
                No se pudo cargar el audio de esta pista.
              </p>
            )}

            <Controls player={player} />
          </div>
        </div>
      </main>

      <footer className="colophon">
        <p className="colophon__title">Now Playing</p>
        <p className="colophon__sub">
          {track ? `${track.name} — ${track.artist}` : 'Cargando catálogo…'}
        </p>
      </footer>
    </div>
  );
}
