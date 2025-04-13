import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Dialog, DialogContent, Grid, Paper, Typography, DialogActions } from '@mui/material';
import QuestionDisplay from '../QuestionDisplay';
import BackgroundMusic from '../BackgroundMusic';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function TicTacToe({ getQuestion, onAnswer }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // true = player's turn (X), false = computer's turn (O)
  const [winner, setWinner] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const boardRef = useRef(Array(9).fill(null));
  const [winningSquares, setWinningSquares] = useState([]);
  const [lastPlayed, setLastPlayed] = useState(null);
  const [showTryAgain, setShowTryAgain] = useState(false);

  // Debug effect to log board changes
  useEffect(() => {
    console.log("Board state updated:", board);
    boardRef.current = [...board];
  }, [board]);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        setWinningSquares(lines[i]);
        return squares[a];
      }
    }
    return null;
  };

  const fetchQuestion = async () => {
    setIsLoading(true);
    try {
      const question = await getQuestion();
      console.log("Fetched question:", question);
      setCurrentQuestion(question);
      setShowQuestion(true);
    } catch (error) {
      console.error('Error fetching question:', error);
      // If there's an error, set player's turn back
      setIsXNext(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (i) => {
    if (winner || board[i] !== null || !isXNext || showQuestion) return;
    
    // Player's move
    const newBoard = [...board];
    newBoard[i] = 'X';
    setLastPlayed(i);
    boardRef.current = newBoard;
    setBoard(newBoard);
    
    // Check for win after player move
    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      return;
    }
    
    // Check for draw
    if (newBoard.every(square => square !== null)) {
      return;
    }
    
    // Show question after player moves
    setIsXNext(false);
    fetchQuestion();
  };

  const handleQuestionAnswered = (isCorrect) => {
    console.log("Question answered:", isCorrect);
    onAnswer(isCorrect);
    
    if (isCorrect) {
      console.log("CORRECT ANSWER - AI SHOULD MOVE");
      
      // First, close question and update score
      setShowQuestion(false);
      setCurrentQuestion(null);
      setScore(prev => prev + 1);
      
      // Make AI move immediately
      console.log("MAKING AI MOVE NOW");
      
      // Get current board state
      const currentBoard = [...board];
      const availableMoves = [];
      
      // Find empty squares
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) {
          availableMoves.push(i);
        }
      }
      
      console.log("Available moves for AI:", availableMoves);
      
      if (availableMoves.length > 0) {
        // Choose random move for AI
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const aiMove = availableMoves[randomIndex];
        
        // Make AI move
        console.log("AI making move at position:", aiMove);
        currentBoard[aiMove] = 'O';
        
        // Update board state
        setBoard(currentBoard);
        setLastPlayed(aiMove);
        boardRef.current = currentBoard;
        
        // Check for win
        const newWinner = calculateWinner(currentBoard);
        if (newWinner) {
          setWinner(newWinner);
        }
        
        // Set back to player's turn
        setIsXNext(true);
      }
      console.log("AI MOVE COMPLETE");
    } else {
      // If incorrect answer, temporarily hide the question and show try again dialog
      console.log("INCORRECT ANSWER - PLAYER WILL TRY AGAIN");
      // Hide the question completely - don't just set showQuestion to false
      // as we'll reopen it when they try again
      setShowQuestion(false);
      setShowTryAgain(true);
    }
  };

  const handleTryAgain = () => {
    console.log("Try again clicked - showing question again");
    // First hide the try again dialog
    setShowTryAgain(false);
    
    // Then reshow the question - with 100ms delay to ensure UI updates properly
    setTimeout(() => {
      console.log("Reshowing the same question in TicTacToe");
      setShowQuestion(true);
    }, 100);
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
        backgroundColor: winningSquares.includes(i) ? 'rgba(76, 175, 80, 0.2)' : 'transparent',
        border: isXNext && board[i] === null && !winner ? '2px dashed rgba(25, 118, 210, 0.5)' : undefined,
        '&.Mui-disabled': {
          color: board[i] === 'X' ? 'primary.main' : 'secondary.main'
        },
        transition: 'all 0.3s ease',
        animation: lastPlayed === i ? 'popIn 0.5s ease-in-out' : undefined,
        '&:hover': {
          backgroundColor: isXNext && board[i] === null && !winner ? 'rgba(25, 118, 210, 0.1)' : undefined,
          transform: isXNext && board[i] === null && !winner ? 'scale(1.05)' : undefined
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
    setWinningSquares([]);
    setLastPlayed(null);
    setShowQuestion(false);
    setCurrentQuestion(null);
    // Increment score if player won
    if (winner === 'X') {
      setScore(prev => prev + 1);
    }
  };

  const getGameStatus = () => {
    if (winner) return `Winner: ${winner}`;
    if (board.every(square => square !== null)) return 'Game Over - Draw!';
    if (isLoading) return 'Loading question...';
    return `Next Player: ${isXNext ? 'X' : 'O'}`;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      position: 'relative',
      p: 2 
    }}>
      <BackgroundMusic audioFile="/music/Learning Groove.mp3" />
      
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
        <Typography variant="h6" sx={{
          color: isXNext ? 'primary.main' : 'secondary.main',
          fontWeight: 'bold',
          animation: 'pulse 1.5s infinite ease-in-out'
        }}>
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

      <Dialog 
        open={showTryAgain} 
        onClose={() => {}}
        disableEscapeKeyDown
      >
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Incorrect Answer!
          </Typography>
          <Typography>
            You must answer the question correctly to continue.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTryAgain} color="primary" variant="contained">
            Try Again
          </Button>
        </DialogActions>
      </Dialog>

      <style jsx="true">{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0.5; }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Box>
  );
}

export default TicTacToe; 