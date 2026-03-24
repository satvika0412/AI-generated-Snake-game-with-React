import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: "DATA_CORRUPTION.WAV", artist: "UNKNOWN_ENTITY", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "MEMORY_LEAK.MP3", artist: "SYS_ADMIN", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "NULL_POINTER.FLAC", artist: "VOID", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setProgress(0); setIsPlaying(true); };
  const prevTrack = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setProgress(0); setIsPlaying(true); };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-[#FF00FF] p-4 relative overflow-hidden glitch-tear">
      <audio ref={audioRef} src={currentTrack.url} onTimeUpdate={handleTimeUpdate} onEnded={nextTrack} />

      <div className="border-b-2 border-[#00FFFF] pb-2 mb-4">
        <h3 className="text-[#00FFFF] font-mono text-2xl uppercase glitch-text">
          {currentTrack.title}
        </h3>
        <p className="text-[#FF00FF] text-lg uppercase">
          AUTHOR: {currentTrack.artist}
        </p>
      </div>

      <div className="mb-4">
        <div className="h-4 w-full bg-black border-2 border-[#00FFFF] cursor-pointer relative" onClick={(e) => {
          if (audioRef.current) {
            const bounds = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - bounds.left) / bounds.width;
            audioRef.current.currentTime = percent * audioRef.current.duration;
            setProgress(percent * 100);
          }
        }}>
          <div className="h-full bg-[#FF00FF]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={prevTrack} className="px-2 py-1 bg-black border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black uppercase">
            &lt;&lt;
          </button>
          <button onClick={togglePlay} className="px-4 py-1 bg-[#FF00FF] text-black font-bold uppercase hover:bg-white">
            {isPlaying ? 'HALT' : 'EXEC'}
          </button>
          <button onClick={nextTrack} className="px-2 py-1 bg-black border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black uppercase">
            &gt;&gt;
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#FF00FF] uppercase">VOL</span>
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-20 accent-[#00FFFF]" />
        </div>
      </div>
    </div>
  );
}
