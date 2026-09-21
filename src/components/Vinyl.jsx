import { useRef } from 'react';

// Borde del disco (inset 2.5% → radio ~47.5). 
const RADIUS = 48.6;
const CIRC = 2 * Math.PI * RADIUS;

/**
 * Disco de vinilo con anillo de progreso arrastrable alrededor.
 */
export function Vinyl({ track, isPlaying, progress, duration, onSeek, onSeekStart, onSeekEnd }) {
  const svgRef = useRef(null);
  const dragging = useRef(false);

  // Convierte la posición del puntero en una fracción 0..1 del círculo
  const fractionFromPointer = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx) + Math.PI / 2;
    const normalized = (angle + 2 * Math.PI) % (2 * Math.PI);
    return normalized / (2 * Math.PI);
  };

  const handleDown = (e) => {
    if (!duration) return;
    dragging.current = true;
    onSeekStart();
    e.currentTarget.setPointerCapture(e.pointerId);
    onSeek(fractionFromPointer(e) * duration);
  };

  const handleMove = (e) => {
    if (!dragging.current || !duration) return;
    onSeek(fractionFromPointer(e) * duration);
  };

  const handleUp = (e) => {
    if (!dragging.current) return;
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    onSeekEnd();
  };

  const angle = progress * 2 * Math.PI - Math.PI / 2;
  const thumbX = 50 + RADIUS * Math.cos(angle);
  const thumbY = 50 + RADIUS * Math.sin(angle);

  return (
    <div className="vinyl">
      <div className={`vinyl__disc ${isPlaying ? 'is-spinning' : ''}`}>
        <div className="vinyl__grooves" />
        <div
          className="vinyl__label"
          style={track?.cover ? { backgroundImage: `url(${track.cover})` } : undefined}
        >
          <span className="vinyl__label-fade" />
        </div>
        <div className="vinyl__spindle" />
      </div>

      <svg
        ref={svgRef}
        className="vinyl__ring"
        viewBox="0 0 100 100"
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        role="slider"
        aria-label="Progreso de la pista"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        tabIndex={0}
      >
        <circle className="vinyl__ring-track" cx="50" cy="50" r={RADIUS} />
        <circle
          className="vinyl__ring-fill"
          cx="50"
          cy="50"
          r={RADIUS}
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - progress)}
        />
        <circle className="vinyl__ring-thumb" cx={thumbX} cy={thumbY} r="2.4" />
      </svg>

      <div className="vinyl__badge">
        <span className="vinyl__badge-eq" aria-hidden="true">
          <i /><i /><i /><i />
        </span>
        <span className="vinyl__badge-text">{track?.name ?? 'Cargando…'}</span>
      </div>
    </div>
  );
}
