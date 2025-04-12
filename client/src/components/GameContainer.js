import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Paper,
  Box,
  CircularProgress,
} from '@material-ui/core';
import io from 'socket.io-client';
import QuestionDisplay from './QuestionDisplay';
import RestMode from './RestMode';
import TicTacToe from './games/TicTacToe';
import ConnectFour from './games/ConnectFour';
import GeometryRunner from './games/GeometryRunner';

const socket = io('http://localhost:5000');

function GameContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { gameType, profile } = location.state;
  const [gameState, setGameState] = useState({
    currentQuestion: null,
    aiAnswer: null,
    moveCount: 0,
    score: 0,
    gameData: [],
  });
  const [showQuestion, setShowQuestion] = useState(false);
  const [showRestMode, setShowRestMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on('question', (question) => {
      setGameState((prev) => ({
        ...prev,
        currentQuestion: question,
      }));
      setShowQuestion(true);
    });

    socket.on('ai_answer', (answer) => {
      setGameState((prev) => ({
        ...prev,
        aiAnswer: answer,
      }));
    });

    return () => {
      socket.off('question');
      socket.off('ai_answer');
    };
  }, []);

  const handleQuestionAnswer = async (answer) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/check-ethics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: gameState.currentQuestion,
        }),
      });
      const { result } = await response.json();

      if (result.startsWith('SAFE')) {
        const isCorrect = answer === gameState.currentQuestion.correctAnswer;
        setGameState((prev) => ({
          ...prev,
          score: prev.score + (isCorrect ? 1 : 0),
          moveCount: prev.moveCount + 1,
          gameData: [
            ...prev.gameData,
            {
              question: prev.currentQuestion,
              playerAnswer: answer,
              aiAnswer: prev.aiAnswer,
              isCorrect,
            },
          ],
        }));

        if ((prev.moveCount + 1) % 5 === 0) {
          setShowRestMode(true);
        }
      } else {
        alert('Question content was flagged as inappropriate. Generating new question...');
        generateNewQuestion();
      }
    } catch (error) {
      console.error('Error checking ethics:', error);
    }
    setLoading(false);
    setShowQuestion(false);
  };

  const generateNewQuestion = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gradeLevel: profile.gradeLevel,
          subject: profile.subject,
          difficulty: profile.difficulty,
        }),
      });
      const { question } = await response.json();
      socket.emit('generate_question', question);
    } catch (error) {
      console.error('Error generating question:', error);
    }
    setLoading(false);
  };

  const handleGameMove = () => {
    generateNewQuestion();
  };

  const handleRestModeComplete = () => {
    setShowRestMode(false);
  };

  const renderGame = () => {
    switch (gameType) {
      case 'tic-tac-toe':
        return <TicTacToe onMove={handleGameMove} />;
      case 'connect-four':
        return <ConnectFour onMove={handleGameMove} />;
      case 'geometry-runner':
        return <GeometryRunner onMove={handleGameMove} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                {gameType.replace(/-/g, ' ').toUpperCase()}
              </Typography>
              <Typography variant="h6">
                Score: {gameState.score} | Moves: {gameState.moveCount}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {renderGame()}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3}>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
                Game Stats
              </Typography>
              <Typography>
                Grade: {profile.gradeLevel}
                <br />
                Subject: {profile.subject}
                <br />
                Difficulty: {profile.difficulty}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={showQuestion} onClose={() => setShowQuestion(false)}>
        <QuestionDisplay
          question={gameState.currentQuestion}
          onAnswer={handleQuestionAnswer}
          aiAnswer={gameState.aiAnswer}
        />
      </Dialog>

      <Dialog open={showRestMode} onClose={handleRestModeComplete}>
        <RestMode
          gradeLevel={profile.gradeLevel}
          subject={profile.subject}
          onComplete={handleRestModeComplete}
        />
      </Dialog>

      {loading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="rgba(0, 0, 0, 0.5)"
        >
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
}

export default GameContainer; 