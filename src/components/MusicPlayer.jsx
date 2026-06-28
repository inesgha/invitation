import { memo, useCallback, useEffect, useRef, useState } from 'react';
import ambientTrack from '../assets/music/music.mp3';

function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.55);
  const [needsGesture, setNeedsGesture] = useState(false);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.volume = volume;
      await audio.play();
      setIsPlaying(true);
      setNeedsGesture(false);
    } catch {
      setNeedsGesture(true);
      setIsPlaying(false);
    }
  }, [volume]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(play, 700);
    return () => window.clearTimeout(timer);
  }, [play]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  return (
    <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-champagne/25 bg-ivory/10 px-3 py-2 shadow-luxury backdrop-blur-xl sm:left-auto sm:right-5 sm:translate-x-0" aria-label="Music controls">
      <audio ref={audioRef} src={ambientTrack} loop preload="auto" />
      <button
        type="button"
        onClick={isPlaying ? pause : play}
        className="grid h-10 w-10 place-items-center rounded-full border border-champagne/25 text-champagne transition hover:bg-champagne/15"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        <span className="flex h-4 items-end gap-1" aria-hidden="true">
          <i className={'w-1 rounded-full bg-current ' + (isPlaying ? 'h-4 animate-pulse' : 'h-2')} />
          <i className={'w-1 rounded-full bg-current ' + (isPlaying ? 'h-3 animate-pulse' : 'h-2')} />
          <i className={'w-1 rounded-full bg-current ' + (isPlaying ? 'h-5 animate-pulse' : 'h-2')} />
        </span>
      </button>
      <label className="sr-only" htmlFor="volume">Volume</label>
      <input
        id="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(event) => setVolume(Number(event.target.value))}
        className="h-1 w-20 accent-gold"
        aria-label="Music volume"
      />
      {needsGesture && <span className="pr-2 text-xs text-champagne/80">Tap play</span>}
    </div>
  );
}

export default memo(MusicPlayer);
