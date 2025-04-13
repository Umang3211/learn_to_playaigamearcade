import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Slider } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const BackgroundMusic = ({ audioFile = "/music/Learning Groove.mp3", autoPlay = true }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  useEffect(() => {
    const audio = audioRef.current;
    
    // Set initial state
    if (audio) {
      audio.volume = volume;
      audio.muted = isMuted;
      audio.loop = true;
      
      // Auto-play is often blocked by browsers, we'll handle this with user interaction
      if (autoPlay) {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              console.log("Music autoplay successful");
            })
            .catch(error => {
              // Autoplay was prevented
              console.log("Autoplay prevented:", error);
              setIsPlaying(false);
              
              // Add event listener to try playing on first user interaction
              const tryPlayOnUserInteraction = () => {
                audio.play().then(() => {
                  setIsPlaying(true);
                  console.log("Music playing after user interaction");
                  // Remove the event listeners after successful play
                  document.removeEventListener('click', tryPlayOnUserInteraction);
                  document.removeEventListener('keydown', tryPlayOnUserInteraction);
                }).catch(e => console.log("Still can't play audio:", e));
              };
              
              document.addEventListener('click', tryPlayOnUserInteraction);
              document.addEventListener('keydown', tryPlayOnUserInteraction);
            });
        }
      }
    }
    
    return () => {
      // Clean up when component unmounts
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        
        // Clean up event listeners if they were added
        document.removeEventListener('click', () => {});
        document.removeEventListener('keydown', () => {});
      }
    };
  }, [audioFile, autoPlay, volume, isMuted]);
  
  const togglePlay = () => {
    const audio = audioRef.current;
    
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    const audio = audioRef.current;
    
    if (audio) {
      audio.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleVolumeChange = (event, newValue) => {
    const audio = audioRef.current;
    
    if (audio) {
      audio.volume = newValue;
      setVolume(newValue);
      
      // If we change from volume 0, unmute
      if (newValue > 0 && isMuted) {
        audio.muted = false;
        setIsMuted(false);
      }
      
      // If we change to volume 0, mute
      if (newValue === 0 && !isMuted) {
        setIsMuted(true);
      }
    }
  };
  
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      position: 'absolute', 
      bottom: 10, 
      right: 10, 
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 2,
      padding: 1
    }}>
      <audio ref={audioRef} src={audioFile} loop preload="auto" />
      
      <IconButton 
        onClick={togglePlay} 
        color="primary" 
        size="small"
      >
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      
      <IconButton 
        onClick={toggleMute} 
        color="primary" 
        size="small"
      >
        {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </IconButton>
      
      <Slider
        value={isMuted ? 0 : volume}
        onChange={handleVolumeChange}
        min={0}
        max={1}
        step={0.01}
        sx={{ 
          width: 80, 
          ml: 1,
          color: 'primary.main'
        }}
      />
    </Box>
  );
};

export default BackgroundMusic; 