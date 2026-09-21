import { usePlayer } from './hooks/usePlayer.js';
import { TRACKS, FEATURED } from './tracks.js';
import { Vinyl } from './components/Vinyl.jsx';
import { TrackList } from './components/TrackList.jsx';
import { Controls } from './components/Controls.jsx';

export default function App() {
  const player = usePlayer(TRACKS);
  const { track, index, isPlaying, progress, duration, seek, selectTrack, setIsSeeking } = player;

  return (
    <div className="shell">
      <header className="masthead">
        <h1 className="masthead__brand">Saviom</h1>
        <p className="masthead__tagline">Music Streaming</p>
      </header>

      <main className="stage">
        <nav className="stage__nav">
          <span className="stage__logo">S/M</span>
          <ul className="stage__links">
            <li><a href="#tracklist">Artists</a></li>
            <li><a href="#tracklist">Mixtapes</a></li>
            <li><a href="#tracklist">Awards</a></li>
          </ul>
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
                {FEATURED.title.map((line) => (
                  <span key={line} className="feature__line">{line}</span>
                ))}
              </h2>
              <p className="feature__genres">{FEATURED.genres.join(', ')}</p>
            </section>

            <div id="tracklist">
              <TrackList
                tracks={TRACKS}
                currentIndex={index}
                isPlaying={isPlaying}
                onSelect={selectTrack}
              />
            </div>

            <Controls player={player} />
          </div>
        </div>
      </main>

      <footer className="colophon">
        <p className="colophon__title">Now Playing</p>
        <p className="colophon__sub">
          {track.name} — {track.artist}
        </p>
      </footer>
    </div>
  );
}
