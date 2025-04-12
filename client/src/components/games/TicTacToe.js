import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, Grid, Paper, Typography } from '@mui/material';
import QuestionDisplay from '../QuestionDisplay';

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // true = player's turn (X), false = computer's turn (O)
  const [winner, setWinner] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [pendingMove, setPendingMove] = useState(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const makeAIMove = () => {
    console.log("Making AI move");
    const newBoard = [...board];
    const availableSquares = board.reduce((acc, square, index) => {
      if (!square) acc.push(index);
      return acc;
    }, []);

    if (availableSquares.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableSquares.length);
      const aiMove = availableSquares[randomIndex];
      console.log("AI choosing square:", aiMove);
      newBoard[aiMove] = 'O';
      setBoard(newBoard);
      setIsXNext(true);
      const newWinner = calculateWinner(newBoard);
      if (newWinner) {
        setWinner(newWinner);
      }
    }
  };

  const fetchQuestion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gradeLevel: '5',
          subject: 'Math',
          difficulty: 'Medium'
        }),
      });
      const data = await response.json();
      console.log("Received question:", data);
      setCurrentQuestion(data);
      setShowQuestion(true);
    } catch (error) {
      console.error('Error fetching question:', error);
      setShowQuestion(false);
      setCurrentQuestion(null);
      setPendingMove(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (i) => {
    // Only allow clicks if it's player's turn, square is empty, no winner, and not loading
    if (!isXNext || board[i] || winner || isLoading || showQuestion) return;
    
    console.log("Player clicked square:", i);
    const newBoard = [...board];
    newBoard[i] = 'X'; // Temporarily place X
    setBoard(newBoard);
    setPendingMove(i);
    fetchQuestion();
  };

  const handleQuestionAnswered = (isCorrect) => {
    console.log("Question answered:", isCorrect);
    
    if (!isCorrect) {
      // If incorrect, remove the X and let player try again
      const newBoard = [...board];
      newBoard[pendingMove] = null;
      setBoard(newBoard);
      setTimeout(() => {
        setShowQuestion(false);
        setCurrentQuestion(null);
        setPendingMove(null);
      }, 1500);
      return;
    }

    // If correct, keep the X and make AI move
    setScore(score + 1);
    
    // Check for winner after player's move
    const newWinner = calculateWinner(board);
    if (newWinner) {
      setWinner(newWinner);
      setShowQuestion(false);
      setCurrentQuestion(null);
      setPendingMove(null);
      return;
    }

    // Check if board is full
    if (board.every(square => square !== null)) {
      setShowQuestion(false);
      setCurrentQuestion(null);
      setPendingMove(null);
      return;
    }

    // Close question dialog and make AI move
    setShowQuestion(false);
    setCurrentQuestion(null);
    setPendingMove(null);
    setIsXNext(false);

    // Make AI move after a short delay
    setTimeout(() => {
      makeAIMove();
    }, 1000);
  };

  const renderSquare = (i) => (
    <Button
      variant="outlined"
      onClick={() => handleClick(i)}
      disabled={!isXNext || winner !== null || isLoading || board[i] !== null || showQuestion}
      sx={{
        width: 80,
        height: 80,
        fontSize: '2rem',
        m: 0.5,
        color: board[i] === 'X' ? 'primary.main' : 'secondary.main',
        '&.Mui-disabled': {
          color: board[i] === 'X' ? 'primary.main' : 'secondary.main'
        }
      }}
    >
      {board[i]}
    </Button>
  );

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setShowQuestion(false);
    setCurrentQuestion(null);
    setPendingMove(null);
    setIsLoading(false);
  };

  const getGameStatus = () => {
    if (winner) return `Winner: ${winner}`;
    if (board.every(square => square !== null)) return 'Game Over - Draw!';
    if (isLoading) return 'Loading question...';
    return `Next Player: ${isXNext ? 'X' : 'O'}`;
  };

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tic Tac Toe
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        Score: {score}
      </Typography>

      <Paper elevation={3} sx={{ maxWidth: 300, mx: 'auto', p: 2 }}>
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={12}>
            <Box>
              {renderSquare(0)}{renderSquare(1)}{renderSquare(2)}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box>
              {renderSquare(3)}{renderSquare(4)}{renderSquare(5)}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box>
              {renderSquare(6)}{renderSquare(7)}{renderSquare(8)}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">
          {getGameStatus()}
        </Typography>
        <Button variant="contained" onClick={resetGame} sx={{ mt: 2 }}>
          Reset Game
        </Button>
      </Box>

      <Dialog 
        open={showQuestion && currentQuestion !== null} 
        maxWidth="sm" 
        fullWidth
        disableEscapeKeyDown
        onClose={() => {}}
      >
        <DialogContent>
          <QuestionDisplay
            question={currentQuestion?.question}
            options={currentQuestion?.options || {}}
            correctAnswer={currentQuestion?.correctAnswer}
            onAnswer={handleQuestionAnswered}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default TicTacToe; 