import { useCallback, useEffect, useRef, useState } from 'react';

const REPEAT_MODES = ['off', 'all', 'one'];

export function usePlayer(tracks) {
  const audioRef = useRef(null);
  if (audioRef.current === null) {
    audioRef.current = new Audio();
  }

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off');
  const [isSeeking, setIsSeeking] = useState(false);

  const track = tracks[index];

  // Refs espejo para que los listeners del elemento <audio> lean el estado
  // actual sin tener que re-suscribirse en cada cambio.
  const stateRef = useRef({ shuffle, repeat, index, isSeeking });
  stateRef.current = { shuffle, repeat, index, isSeeking };

  const pickNext = useCallback(
    (direction) => {
      const { shuffle: sh, repeat: rp, index: i } = stateRef.current;
      if (sh && tracks.length > 1) {
        // Evita repetir la pista actual al azar.
        let next = i;
        while (next === i) next = Math.floor(Math.random() * tracks.length);
        return next;
      }
      const next = i + direction;
      if (next >= tracks.length) return rp === 'all' ? 0 : tracks.length - 1;
      if (next < 0) return tracks.length - 1;
      return next;
    },
    [tracks.length],
  );

  const play = useCallback(() => {
    audioRef.current.play().catch(() => setIsPlaying(false));
  }, []);

  const pause = useCallback(() => audioRef.current.pause(), []);

  const toggle = useCallback(() => {
    if (audioRef.current.paused) play();
    else pause();
  }, [play, pause]);

  const selectTrack = useCallback((i, autoplay = true) => {
    setIndex(i);
    if (autoplay) {
      // El <audio> arranca tras el efecto que cambia el src.
      audioRef.current.autoplay = true;
    }
  }, []);

  const next = useCallback(() => {
    const target = pickNext(1);
    const { index: i, repeat: rp } = stateRef.current;
    // En repeat 'off', si ya estamos en la última, no reinicia solo, solamente deja de sonar.
    if (target === i && rp === 'off') return;
    selectTrack(target);
  }, [pickNext, selectTrack]);

  const prev = useCallback(() => {
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    selectTrack(pickNext(-1));
  }, [pickNext, selectTrack]);

  const seek = useCallback((seconds) => {
    audioRef.current.currentTime = seconds;
    setCurrentTime(seconds);
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeat((r) => REPEAT_MODES[(REPEAT_MODES.indexOf(r) + 1) % REPEAT_MODES.length]);
  }, []);

  // Carga la pista cuando cambia el índice y resetea el tiempo y duración respectivamente.
  useEffect(() => {
    const audio = audioRef.current;
    if (!track) return;
    audio.src = track.src;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
  }, [track]);

  // Sincroniza volumen / mute.
  useEffect(() => {
    audioRef.current.volume = volume;
    audioRef.current.muted = muted;
  }, [volume, muted]);

  // Un solo juego de listeners para todo el ciclo de vida del <audio>.
  useEffect(() => {
    const audio = audioRef.current;

    const onTime = () => {
      if (!stateRef.current.isSeeking) setCurrentTime(audio.currentTime);
    };
    const onMeta = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      if (stateRef.current.repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
        return;
      }
      const target = pickNext(1);
      const { index: i, repeat: rp } = stateRef.current;
      if (target === i && rp === 'off') {
        setIsPlaying(false);
        return;
      }
      audio.autoplay = true;
      setIndex(target);
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('durationchange', onMeta);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('durationchange', onMeta);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [pickNext]);

  // Pausa el <audio> al desmontar para que no siga propagando eventos de sonido y no se quede sonando en background.
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Atajos de teclado.
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      switch (e.code) {
        case 'Space':
          // Sobre un botón enfocado, Space ya dispara su click: dejar que
          // ambos corran alternaría el estado dos veces y se anularía.
          if (tag === 'BUTTON') return;
          e.preventDefault();
          toggle();
          break;
        case 'ArrowRight':
          if (e.shiftKey) next();
          else seek(Math.min(audioRef.current.currentTime + 5, audioRef.current.duration || 0));
          break;
        case 'ArrowLeft':
          if (e.shiftKey) prev();
          else seek(Math.max(audioRef.current.currentTime - 5, 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((v) => Math.min(1, +(v + 0.05).toFixed(2)));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((v) => Math.max(0, +(v - 0.05).toFixed(2)));
          break;
        case 'KeyM':
          setMuted((m) => !m);
          break;
        case 'KeyS':
          setShuffle((s) => !s);
          break;
        case 'KeyR':
          cycleRepeat();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, next, prev, seek, cycleRepeat]);

  // Media Session API: controles nativos en macOS/Android y teclas de medios.
  useEffect(() => {
    if (!('mediaSession' in navigator) || !track) return;
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: track.name,
      artist: track.artist,
      album: track.album ?? '',
      artwork: [{ src: track.cover, sizes: '512x512' }],
    });
    navigator.mediaSession.setActionHandler('play', play);
    navigator.mediaSession.setActionHandler('pause', pause);
    navigator.mediaSession.setActionHandler('previoustrack', prev);
    navigator.mediaSession.setActionHandler('nexttrack', next);
  }, [track, play, pause, prev, next]);

  return {
    track,
    index,
    tracks,
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    shuffle,
    repeat,
    progress: duration ? currentTime / duration : 0,
    toggle,
    next,
    prev,
    seek,
    selectTrack,
    setVolume,
    setMuted,
    setShuffle,
    cycleRepeat,
    setIsSeeking,
  };
}

export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
