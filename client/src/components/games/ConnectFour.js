import React, { useState } from 'react';
import { Box, Button, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import QuestionDisplay from '../QuestionDisplay';

function ConnectFour() {
  const [board, setBoard] = useState(Array(6).fill().map(() => Array(7).fill(null)));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState([]);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [lastMove, setLastMove] = useState(null);

  const checkWinner = (board) => {
    // Check horizontal
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] && 
            board[row][col] === board[row][col + 1] && 
            board[row][col] === board[row][col + 2] && 
            board[row][col] === board[row][col + 3]) {
          return board[row][col];
        }
      }
    }

    // Check vertical
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 7; col++) {
        if (board[row][col] && 
            board[row][col] === board[row + 1][col] && 
            board[row][col] === board[row + 2][col] && 
            board[row][col] === board[row + 3][col]) {
          return board[row][col];
        }
      }
    }

    // Check diagonal (down-right)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] && 
            board[row][col] === board[row + 1][col + 1] && 
            board[row][col] === board[row + 2][col + 2] && 
            board[row][col] === board[row + 3][col + 3]) {
          return board[row][col];
        }
      }
    }

    // Check diagonal (down-left)
    for (let row = 0; row < 3; row++) {
      for (let col = 3; col < 7; col++) {
        if (board[row][col] && 
            board[row][col] === board[row + 1][col - 1] && 
            board[row][col] === board[row + 2][col - 2] && 
            board[row][col] === board[row + 3][col - 3]) {
          return board[row][col];
        }
      }
    }

    return null;
  };

  const makeAIMove = () => {
    const availableColumns = [];
    for (let col = 0; col < 7; col++) {
      if (board[0][col] === null) {
        availableColumns.push(col);
      }
    }

    if (availableColumns.length > 0) {
      const randomCol = availableColumns[Math.floor(Math.random() * availableColumns.length)];
      const newBoard = [...board];
      for (let row = 5; row >= 0; row--) {
        if (newBoard[row][randomCol] === null) {
          newBoard[row][randomCol] = 'O';
          break;
        }
      }
      setBoard(newBoard);
      const newWinner = checkWinner(newBoard);
      if (newWinner) {
        setWinner(newWinner);
      } else if (newBoard.every(row => row.every(cell => cell !== null))) {
        setWinner('Draw');
      }
    }
    setIsPlayerTurn(true);
  };

  const handleColumnClick = async (col) => {
    if (!isPlayerTurn || winner || board[0][col] !== null) return;

    const newBoard = [...board];
    let rowIndex = -1;
    for (let row = 5; row >= 0; row--) {
      if (newBoard[row][col] === null) {
        newBoard[row][col] = 'X';
        rowIndex = row;
        break;
      }
    }
    setBoard(newBoard);
    setLastMove({ row: rowIndex, col });

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setScore(score + 1);
      return;
    }

    if (newBoard.every(row => row.every(cell => cell !== null))) {
      setWinner('Draw');
      return;
    }

    setIsPlayerTurn(false);
    setShowQuestion(true);
    
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
      if (data.error) {
        throw new Error(data.error);
      }
      setCurrentQuestion(data);
    } catch (error) {
      console.error('Error fetching question:', error);
      setIsPlayerTurn(true);
    }
  };

  const handleQuestionAnswered = (isCorrect) => {
    setShowQuestion(false);
    setCurrentQuestion(null);
    if (isCorrect) {
      setQuestionsAnswered([...questionsAnswered, { correct: true }]);
      setScore(score + 1);
      makeAIMove();
    } else {
      setQuestionsAnswered([...questionsAnswered, { correct: false }]);
      setShowTryAgain(true);
    }
  };

  const handleTryAgain = () => {
    setShowTryAgain(false);
    if (lastMove) {
      const newBoard = [...board];
      newBoard[lastMove.row][lastMove.col] = null;
      setBoard(newBoard);
      setLastMove(null);
    }
    setIsPlayerTurn(true);
  };

  const resetGame = () => {
    setBoard(Array(6).fill().map(() => Array(7).fill(null)));
    setIsPlayerTurn(true);
    setWinner(null);
    setQuestionsAnswered([]);
    setScore(0);
    setShowQuestion(false);
    setCurrentQuestion(null);
    setShowTryAgain(false);
    setLastMove(null);
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        {winner ? `Winner: ${winner}` : isPlayerTurn ? 'Your turn' : 'AI is thinking...'}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Score: {score}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {board.map((row, rowIndex) => (
          <Box key={rowIndex} sx={{ display: 'flex' }}>
            {row.map((_, colIndex) => (
              <Button
                key={colIndex}
                variant="outlined"
                sx={{
                  width: '60px',
                  height: '60px',
                  minWidth: '60px',
                  margin: '2px',
                  backgroundColor: board[rowIndex][colIndex] === 'X' ? '#ff5252' : board[rowIndex][colIndex] === 'O' ? '#2196f3' : 'white',
                  '&:hover': {
                    backgroundColor: board[rowIndex][colIndex] === null ? '#e0e0e0' : undefined,
                  },
                }}
                onClick={() => handleColumnClick(colIndex)}
                disabled={!isPlayerTurn || winner || board[0][colIndex] !== null}
              />
            ))}
          </Box>
        ))}
      </Box>

      <Dialog open={showQuestion} onClose={() => setShowQuestion(false)}>
        <DialogContent>
          {currentQuestion && (
            <QuestionDisplay
              question={currentQuestion.question}
              options={currentQuestion.options}
              correctAnswer={currentQuestion.correctAnswer}
              onAnswer={handleQuestionAnswered}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showTryAgain} onClose={() => setShowTryAgain(false)}>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Incorrect Answer!
          </Typography>
          <Typography>
            Try again to place your piece.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTryAgain} color="primary">
            Try Again
          </Button>
        </DialogActions>
      </Dialog>

      {winner && (
        <Button
          variant="contained"
          color="primary"
          onClick={resetGame}
          sx={{ mt: 2 }}
        >
          Play Again
        </Button>
      )}
    </Box>
  );
}

export default ConnectFour; 