import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import QuestionDisplay from '../QuestionDisplay';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 50;
const OBSTACLE_WIDTH = 20;
const OBSTACLE_HEIGHT = 30;
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const OBSTACLE_SPEED = 5;
const OBSTACLE_INTERVAL = 2000;

function GeometryRunner({ onQuestionNeeded, onGameEnd }) {
  const canvasRef = useRef(null);
  const [gameStatus, setGameStatus] = useState('start');
  const [score, setScore] = useState(0);
  const [player, setPlayer] = useState({ x: 50, y: CANVAS_HEIGHT - PLAYER_HEIGHT, velocity: 0 });
  const [obstacles, setObstacles] = useState([]);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const animationFrameId = useRef(null);
  const lastObstacleTime = useRef(0);

  const resetGame = () => {
    setGameStatus('playing');
    setScore(0);
    setPlayer({ x: 50, y: CANVAS_HEIGHT - PLAYER_HEIGHT, velocity: 0 });
    setObstacles([]);
    setShowQuestion(false);
    setCurrentQuestion(null);
    lastObstacleTime.current = 0;
  };

  const handleDeath = useCallback(async () => {
    try {
      const question = await onQuestionNeeded();
      if (question) {
        setCurrentQuestion(question);
        setShowQuestion(true);
        setGameStatus('question');
      } else {
        setGameStatus('dead');
      }
    } catch (error) {
      console.error('Error getting question:', error);
      setGameStatus('dead');
    }
  }, [onQuestionNeeded]);

  const handleQuestionAnswered = useCallback((isCorrect) => {
    setShowQuestion(false);
    setCurrentQuestion(null);
    if (isCorrect) {
      resetGame();
    } else {
      setGameStatus('dead');
    }
  }, []);

  const gameLoop = useCallback(() => {
    if (gameStatus !== 'playing') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Update player position
    const newPlayer = {
      ...player,
      velocity: player.velocity + GRAVITY,
      y: Math.min(player.y + player.velocity, CANVAS_HEIGHT - PLAYER_HEIGHT)
    };

    // Check for ground collision
    if (newPlayer.y >= CANVAS_HEIGHT - PLAYER_HEIGHT) {
      newPlayer.y = CANVAS_HEIGHT - PLAYER_HEIGHT;
      newPlayer.velocity = 0;
    }

    setPlayer(newPlayer);

    // Update obstacles
    const now = Date.now();
    if (now - lastObstacleTime.current > OBSTACLE_INTERVAL) {
      setObstacles(prev => [...prev, {
        x: CANVAS_WIDTH,
        y: CANVAS_HEIGHT - OBSTACLE_HEIGHT
      }]);
      lastObstacleTime.current = now;
    }

    setObstacles(prev => prev.map(obstacle => ({
      ...obstacle,
      x: obstacle.x - OBSTACLE_SPEED
    })).filter(obstacle => obstacle.x > -OBSTACLE_WIDTH));

    // Check for collisions
    const collision = obstacles.some(obstacle => {
      return (
        player.x < obstacle.x + OBSTACLE_WIDTH &&
        player.x + PLAYER_WIDTH > obstacle.x &&
        player.y < obstacle.y + OBSTACLE_HEIGHT &&
        player.y + PLAYER_HEIGHT > obstacle.y
      );
    });

    if (collision) {
      handleDeath();
      return;
    }

    // Update score
    setScore(prev => prev + 1);

    // Draw player
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT);

    // Draw obstacles
    ctx.fillStyle = '#F44336';
    obstacles.forEach(obstacle => {
      ctx.fillRect(obstacle.x, obstacle.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
    });

    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [gameStatus, player, obstacles, score, handleDeath]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        if (gameStatus === 'playing' && player.y === CANVAS_HEIGHT - PLAYER_HEIGHT) {
          setPlayer(prev => ({ ...prev, velocity: JUMP_FORCE }));
        } else if (e.code === 'Escape') {
          setGameStatus(prev => prev === 'playing' ? 'paused' : 'playing');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    if (gameStatus === 'playing') {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameStatus, player.y, gameLoop]);

  const renderGameOverlay = () => {
    if (gameStatus === 'start') {
      return (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <Typography variant="h4" gutterBottom>
            Geometry Runner
          </Typography>
          <Typography variant="body1" gutterBottom>
            Press Space to jump, Escape to pause
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => resetGame()}
            sx={{ mt: 2 }}
          >
            Start Game
          </Button>
        </Box>
      );
    } else if (gameStatus === 'paused') {
      return (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <Typography variant="h4" gutterBottom>
            Game Paused
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setGameStatus('playing')}
            sx={{ mt: 2 }}
          >
            Resume
          </Button>
        </Box>
      );
    } else if (gameStatus === 'dead') {
      return (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <Typography variant="h4" gutterBottom>
            Game Over!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Final Score: {score}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => resetGame()}
            sx={{ mt: 2 }}
          >
            Play Again
          </Button>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      width: '100%',
      maxWidth: CANVAS_WIDTH,
      margin: '0 auto',
      padding: '20px'
    }}>
      <Box sx={{ 
        position: 'relative', 
        width: CANVAS_WIDTH, 
        height: CANVAS_HEIGHT,
        marginBottom: '20px'
      }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{ 
            border: '1px solid black',
            backgroundColor: '#f0f0f0',
            width: '100%',
            height: '100%'
          }}
        />
        {renderGameOverlay()}
      </Box>
      {gameStatus === 'question' && showQuestion && currentQuestion && (
        <QuestionDisplay
          question={currentQuestion.question}
          options={currentQuestion.options}
          onAnswer={handleQuestionAnswered}
        />
      )}
    </Box>
  );
}

export default GeometryRunner; 