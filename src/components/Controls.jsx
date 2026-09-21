import { formatTime } from '../hooks/usePlayer.js';
import * as Icon from './icons.jsx';

export function Controls({ player }) {
  const {
    isPlaying, currentTime, duration, volume, muted, shuffle, repeat,
    toggle, next, prev, setVolume, setMuted, setShuffle, cycleRepeat,
  } = player;

  const RepeatIcon = repeat === 'one' ? Icon.RepeatOne : Icon.Repeat;

  return (
    <div className="controls">
      <div className="controls__transport">
        <button
          type="button"
          className={`ctrl ctrl--ghost ${shuffle ? 'is-on' : ''}`}
          onClick={() => setShuffle((s) => !s)}
          aria-pressed={shuffle}
          title="Aleatorio (S)"
        >
          <Icon.Shuffle width="18" height="18" />
        </button>

        <button type="button" className="ctrl ctrl--ghost" onClick={prev} title="Anterior (Shift+←)">
          <Icon.Prev width="20" height="20" />
        </button>

        <button
          type="button"
          className="ctrl ctrl--primary"
          onClick={toggle}
          title={isPlaying ? 'Pausar (Espacio)' : 'Reproducir (Espacio)'}
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isPlaying ? <Icon.Pause width="22" height="22" /> : <Icon.Play width="22" height="22" />}
        </button>

        <button type="button" className="ctrl ctrl--ghost" onClick={next} title="Siguiente (Shift+→)">
          <Icon.Next width="20" height="20" />
        </button>

        <button
          type="button"
          className={`ctrl ctrl--ghost ${repeat !== 'off' ? 'is-on' : ''}`}
          onClick={cycleRepeat}
          title={`Repetir: ${repeat} (R)`}
        >
          <RepeatIcon width="18" height="18" />
        </button>
      </div>

      <div className="controls__volume">
        <button
          type="button"
          className="ctrl ctrl--ghost ctrl--sm"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? 'Activar sonido' : 'Silenciar'}
          title="Silenciar (M)"
        >
          {muted || volume === 0
            ? <Icon.VolumeMuted width="16" height="16" />
            : <Icon.Volume width="16" height="16" />}
        </button>
        <input
          className="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={muted ? 0 : volume}
          onChange={(e) => {
            setVolume(Number(e.target.value));
            if (muted) setMuted(false);
          }}
          style={{ '--fill': `${(muted ? 0 : volume) * 100}%` }}
          aria-label="Volumen"
        />
      </div>

      <div className="controls__time">
        <span className="controls__time-now">{formatTime(currentTime)}</span>
        <span className="controls__time-sep">/</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
