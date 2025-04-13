import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import QuestionDisplay from '../QuestionDisplay';
import BackgroundMusic from '../BackgroundMusic';

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

function GeometryRunner({ getQuestion, onAnswer }) {
  const canvasRef = useRef(null);
  const [gameStatus, setGameStatus] = useState('start');
  const [score, setScore] = useState(0);
  const [player, setPlayer] = useState({ x: 50, y: CANVAS_HEIGHT - PLAYER_HEIGHT, velocity: 0 });
  const [obstacles, setObstacles] = useState([]);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const animationFrameId = useRef(null);
  const lastObstacleTime = useRef(0);
  const gameLoopRef = useRef(null);
  const [backgroundX, setBackgroundX] = useState(0);
  const [difficulty, setDifficulty] = useState(1);

  // Add roundRect polyfill
  useEffect(() => {
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + width, y, x + width, y + height, radius);
        this.arcTo(x + width, y + height, x, y + height, radius);
        this.arcTo(x, y + height, x, y, radius);
        this.arcTo(x, y, x + width, y, radius);
        this.closePath();
        return this;
      };
    }
  }, []);

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
      console.log('Getting question...');
      const question = await getQuestion();
      console.log('Received question:', question);
      if (question) {
        setCurrentQuestion(question);
        setShowQuestion(true);
        setGameStatus('question');
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      } else {
        // If no question is received, show game over
        setGameStatus('dead');
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      }
    } catch (error) {
      console.error('Error getting question:', error);
      // On error, show game over
      setGameStatus('dead');
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }
  }, [getQuestion]);

  const gameLoop = useCallback(() => {
    if (gameStatus !== 'playing') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw scrolling background
    const backgroundSpeed = 2;
    setBackgroundX(prev => (prev - backgroundSpeed) % 50);
    
    // Draw background grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = backgroundX; x < CANVAS_WIDTH; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y < CANVAS_HEIGHT; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

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

    // Increase difficulty as score increases
    if (score > 0 && score % 500 === 0) {
      setDifficulty(prev => Math.min(prev + 0.2, 3));
    }
    
    // Update obstacles
    const now = Date.now();
    if (now - lastObstacleTime.current > OBSTACLE_INTERVAL / difficulty) {
      // Add variety to obstacles (different heights and types)
      const obstacleHeight = OBSTACLE_HEIGHT + Math.floor(Math.random() * 20);
      const obstacleType = Math.floor(Math.random() * 3); // 0: regular, 1: tall, 2: wide
      
      let newObstacle = {
        x: CANVAS_WIDTH,
        y: CANVAS_HEIGHT - obstacleHeight,
        height: obstacleHeight,
        width: OBSTACLE_WIDTH,
        type: obstacleType
      };
      
      // Adjust width for wide obstacles
      if (obstacleType === 2) {
        newObstacle.width = OBSTACLE_WIDTH * 1.5;
      }
      
      setObstacles(prev => [...prev, newObstacle]);
      lastObstacleTime.current = now;
    }

    setObstacles(prev => prev.map(obstacle => ({
      ...obstacle,
      x: obstacle.x - (OBSTACLE_SPEED * difficulty)
    })).filter(obstacle => obstacle.x > -obstacle.width));

    // Check for collisions
    const collision = obstacles.some(obstacle => {
      return (
        player.x < obstacle.x + obstacle.width &&
        player.x + PLAYER_WIDTH > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
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
    // Draw player with rounded corners
    ctx.beginPath();
    ctx.roundRect(player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT, 5);
    ctx.fill();

    // Draw obstacles with different colors based on type
    obstacles.forEach(obstacle => {
      switch(obstacle.type) {
        case 0:
          ctx.fillStyle = '#F44336'; // Red
          break;
        case 1:
          ctx.fillStyle = '#9C27B0'; // Purple
          break;
        case 2:
          ctx.fillStyle = '#FF9800'; // Orange
          break;
        default:
          ctx.fillStyle = '#F44336';
      }
      
      ctx.beginPath();
      ctx.roundRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height, 3);
      ctx.fill();
    });

    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    animationFrameId.current = requestAnimationFrame(gameLoopRef.current);
  }, [gameStatus, player, obstacles, score, backgroundX, difficulty, handleDeath]);

  // Store the game loop in a ref to avoid circular dependencies
  gameLoopRef.current = gameLoop;

  const handleQuestionAnswered = useCallback((isCorrect) => {
    console.log('Question answered:', isCorrect);
    setShowQuestion(false);
    setCurrentQuestion(null);
    onAnswer(isCorrect);
    if (isCorrect) {
      resetGame();
      animationFrameId.current = requestAnimationFrame(gameLoopRef.current);
    } else {
      setGameStatus('dead');
    }
  }, [onAnswer]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        if (gameStatus === 'playing' && player.y === CANVAS_HEIGHT - PLAYER_HEIGHT) {
          setPlayer(prev => ({ ...prev, velocity: JUMP_FORCE }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    if (gameStatus === 'playing') {
      animationFrameId.current = requestAnimationFrame(gameLoopRef.current);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameStatus, player.y]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      <BackgroundMusic audioFile="/music/Learning Groove.mp3" />
      
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{
          border: '1px solid #000',
          backgroundColor: '#f0f0f0'
        }}
      />
      {gameStatus === 'start' && (
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
            Press Space to jump
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
      )}
      {showQuestion && currentQuestion && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          minWidth: '300px'
        }}>
          <QuestionDisplay
            question={currentQuestion.question}
            options={currentQuestion.options}
            correctAnswer={currentQuestion.correctAnswer}
            onAnswer={handleQuestionAnswered}
          />
        </Box>
      )}
      {gameStatus === 'dead' && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          minWidth: '300px'
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
      )}
    </Box>
  );
}

export default GeometryRunner; 