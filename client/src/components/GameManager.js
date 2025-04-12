import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, LinearProgress } from '@mui/material';
import TicTacToe from './games/TicTacToe';
import ConnectFour from './games/ConnectFour';
import GeometryRunner from './games/GeometryRunner';
import QuestionDisplay from './QuestionDisplay';

function GameManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [showLoginDialog, setShowLoginDialog] = useState(true);
  const [error, setError] = useState('');
  const [currentGame, setCurrentGame] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [progress, setProgress] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Check for existing user session
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setShowLoginDialog(false);
      fetchProgress(parsedUser.username);
    }
  }, []);

  // Get initial game from URL path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/tic-tac-toe') {
      setCurrentGame('ticTacToe');
    } else if (path === '/connect-four') {
      setCurrentGame('connectFour');
    } else if (path === '/geometry-runner') {
      setCurrentGame('geometryRunner');
    }
  }, [location.pathname]);

  const fetchProgress = async (username) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${username}/progress`);
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
        if (currentGame) {
          const gameProgress = data[currentGame];
          setTotalQuestions(gameProgress.questionsAnswered);
          setCorrectAnswers(gameProgress.correctAnswers);
        }
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleLogin = async () => {
    if (!username || !gradeLevel) {
      setError('Please enter both username and grade level');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, gradeLevel }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const data = await response.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      setShowLoginDialog(false);
      setError('');
      fetchProgress(data.username);
    } catch (err) {
      setError('Failed to create user. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowLoginDialog(true);
    setProgress(null);
    setTotalQuestions(0);
    setCorrectAnswers(0);
  };

  const updateProgress = async (gameType, newProgress) => {
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.username}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameType,
          progress: newProgress
        }),
      });

      if (response.ok) {
        const updatedProgress = await response.json();
        setProgress(prev => ({
          ...prev,
          [gameType]: updatedProgress
        }));
        setTotalQuestions(updatedProgress.questionsAnswered);
        setCorrectAnswers(updatedProgress.correctAnswers);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleGameSelect = (game) => {
    setCurrentGame(game);
    navigate(`/${game}`);
  };

  const handleQuestionAnswered = async (isCorrect) => {
    setShowQuestion(false);
    if (user && currentGame) {
      const gameProgress = progress[currentGame];
      const newProgress = {
        ...gameProgress,
        questionsAnswered: gameProgress.questionsAnswered + 1,
        correctAnswers: gameProgress.correctAnswers + (isCorrect ? 1 : 0)
      };
      await updateProgress(currentGame, newProgress);
    }
  };

  const renderGame = () => {
    switch (currentGame) {
      case 'ticTacToe':
        return <TicTacToe onQuestionAnswered={handleQuestionAnswered} />;
      case 'connectFour':
        return <ConnectFour onQuestionAnswered={handleQuestionAnswered} />;
      case 'geometryRunner':
        return <GeometryRunner onQuestionAnswered={handleQuestionAnswered} />;
      default:
        return (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
              Welcome to AI Game Arcade!
            </Typography>
            <Typography variant="h6" gutterBottom>
              Select a game to start playing
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
              <Button variant="contained" onClick={() => handleGameSelect('ticTacToe')}>
                Tic Tac Toe
              </Button>
              <Button variant="contained" onClick={() => handleGameSelect('connectFour')}>
                Connect Four
              </Button>
              <Button variant="contained" onClick={() => handleGameSelect('geometryRunner')}>
                Geometry Runner
              </Button>
            </Box>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {user && currentGame && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body1">
              Questions Answered: {totalQuestions}
            </Typography>
            <Typography variant="body1">
              Correct Answers: {correctAnswers}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
      )}

      {renderGame()}

      <Dialog open={showLoginDialog} onClose={() => {}}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Grade Level</InputLabel>
            <Select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              label="Grade Level"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                <MenuItem key={grade} value={grade}>
                  Grade {grade}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogin} color="primary">
            Start Playing
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default GameManager; 