import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, SkipForward, SkipBack, X } from 'lucide-react';
import { Ayah, Surah } from '../types';

interface AudioReciterProps {
  currentSurah: Surah;
  currentAyah?: Ayah | null;
  audioUrl?: string | null;
  onClose?: () => void;
}

export const AudioReciter: React.FC<AudioReciterProps> = ({
  currentSurah,
  currentAyah,
  audioUrl,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const activeSrc = audioUrl || currentAyah?.audio || `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${currentAyah?.number || 1}.mp3`;

  useEffect(() => {
    if (activeSrc && audioRef.current) {
      audioRef.current.src = activeSrc;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.log('Audio autoplay prevented or error', e);
        setIsPlaying(false);
      });
    }
  }, [activeSrc]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!activeSrc) return null;

  return (
    <div id="audio-reciter-bar" className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4">
      <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-stone-900/95 text-stone-100 border border-amber-500/40 shadow-2xl backdrop-blur-md">
        
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onLoadedMetadata={handleTimeUpdate}
        />

        {/* Info & Reciter Tag */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
            <Volume2 className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm text-amber-200">
              {currentAyah ? `Ayah ${currentAyah.numberInSurah}` : 'Verse Recitation'} • {currentSurah.englishName}
            </div>
            <div className="text-[10px] text-stone-400">
              Reciter: Sheikh Mishary Rashid Alafasy
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          
          <button
            id="reciter-play-pause-btn"
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer font-bold"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            id="reciter-mute-btn"
            onClick={toggleMute}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              id="reciter-close-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
