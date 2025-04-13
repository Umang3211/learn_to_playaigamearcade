import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, Dialog, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import QuestionDisplay from '../QuestionDisplay';
import BackgroundMusic from '../BackgroundMusic';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ConnectFour({ getQuestion, onAnswer }) {
  const [board, setBoard] = useState(Array(6).fill().map(() => Array(7).fill(null)));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState([]);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'question', 'aiTurn', 'gameOver'
  const boardRef = useRef(board);

  // Add the fetchQuestion function
  const fetchQuestion = async () => {
    setIsLoading(true);
    try {
      console.log('Getting question...');
      const question = await getQuestion();
      console.log('Received question:', question);
      setIsLoading(false);
      
      if (question) {
        setCurrentQuestion(question);
        setShowQuestion(true);
      } else {
        console.log('No question received, reverting to player turn');
        setIsPlayerTurn(true);
        setGameStatus('playing');
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      setIsLoading(false);
      setIsPlayerTurn(true);
      setGameStatus('playing');
    }
  };

  // Debug effect to track board changes
  useEffect(() => {
    console.log("ConnectFour: Board updated:", board);
    boardRef.current = JSON.parse(JSON.stringify(board)); // Deep copy
  }, [board]);

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

  const handleColumnClick = (col) => {
    if (!isPlayerTurn || winner || board[0][col] !== null) return;
    
    // Find the lowest empty cell in the column
    let row = -1;
    for (let i = 5; i >= 0; i--) {
      if (board[i][col] === null) {
        row = i;
        break;
      }
    }
    
    if (row !== -1) {
      // Create a deep copy of the board
      const newBoard = JSON.parse(JSON.stringify(board));
      newBoard[row][col] = 'X';
      
      // Update the board
      setBoard(newBoard);
      boardRef.current = newBoard;
      setLastMove({ row, col });
      
      // Check if player won
      const newWinner = checkWinner(newBoard);
      if (newWinner) {
        setWinner(newWinner);
        setGameStatus('gameOver');
        return;
      }
      
      // Check if board is full
      if (newBoard.every(row => row.every(cell => cell !== null))) {
        setWinner('Draw');
        setGameStatus('gameOver');
        return;
      }
      
      // Set to AI's turn and fetch a question
      setIsPlayerTurn(false);
      setGameStatus('questionPhase');
      fetchQuestion();
    }
  };

  const handleQuestionAnswered = (isCorrect) => {
    console.log('ConnectFour: Question answered:', isCorrect);
    onAnswer(isCorrect);
    
    if (isCorrect) {
      console.log("CORRECT ANSWER IN CONNECT FOUR - AI SHOULD MOVE");
      
      // First, close the dialog and update score
      setShowQuestion(false);
      setCurrentQuestion(null);
      setQuestionsAnswered(prev => [...prev, { correct: true }]);
      setScore(prev => prev + 1);
      setGameStatus('aiTurn');
      
      // Make AI move immediately instead of using setTimeout
      console.log("CONNECT FOUR: MAKING AI MOVE NOW");
      
      // Get the current board state
      const currentBoard = JSON.parse(JSON.stringify(board));
      console.log("Current board:", currentBoard);
      
      // Find available columns
      const availableColumns = [];
      for (let col = 0; col < 7; col++) {
        if (currentBoard[0][col] === null) {
          availableColumns.push(col);
        }
      }
      
      console.log("Available columns for AI:", availableColumns);
      
      if (availableColumns.length > 0) {
        // Choose random column
        const randomCol = availableColumns[Math.floor(Math.random() * availableColumns.length)];
        console.log("AI choosing column:", randomCol);
        
        // Find lowest empty cell in column
        let placedRow = -1;
        for (let row = 5; row >= 0; row--) {
          if (currentBoard[row][randomCol] === null) {
            currentBoard[row][randomCol] = 'O';
            placedRow = row;
            break;
          }
        }
        
        if (placedRow !== -1) {
          console.log(`AI placed at row ${placedRow}, column ${randomCol}`);
          
          // Update the board with the AI's move
          setBoard(currentBoard);
          boardRef.current = currentBoard;
          setLastMove({ row: placedRow, col: randomCol });
          
          // Check if AI won
          const newWinner = checkWinner(currentBoard);
          if (newWinner) {
            console.log("AI has won!");
            setWinner(newWinner);
            setGameStatus('gameOver');
          } else if (currentBoard.every(row => row.every(cell => cell !== null))) {
            console.log("Game is a draw!");
            setWinner('Draw');
            setGameStatus('gameOver');
          } else {
            setGameStatus('playing');
          }
        }
      }
      
      // Set back to player's turn
      setIsPlayerTurn(true);
      console.log("CONNECT FOUR: AI MOVE COMPLETE");
    } else {
      // If incorrect, keep the question data for retry
      console.log("INCORRECT ANSWER - PLAYER WILL TRY AGAIN");
      // Close question dialog, record the incorrect answer
      setShowQuestion(false);
      setQuestionsAnswered(prev => [...prev, { correct: false }]);
      // Show the try again dialog
      setShowTryAgain(true);
    }
  };

  const handleTryAgain = () => {
    console.log("Try again clicked - showing question again");
    // First hide the try again dialog
    setShowTryAgain(false);
    
    // Then show the question again with a small delay to ensure UI updates properly
    setTimeout(() => {
      console.log("Reshowing the same question in ConnectFour");
      setShowQuestion(true);
    }, 100);
  };

  const resetGame = () => {
    setBoard(Array(6).fill().map(() => Array(7).fill(null)));
    setIsPlayerTurn(true);
    setWinner(null);
    setQuestionsAnswered([]);
    setShowQuestion(false);
    setCurrentQuestion(null);
    setShowTryAgain(false);
    setLastMove(null);
    setGameStatus('playing');
    boardRef.current = Array(6).fill().map(() => Array(7).fill(null));
    // Increment score if player won
    if (winner === 'X') {
      setScore(prev => prev + 1);
    }
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
      <Typography variant="h5" gutterBottom>
        {winner ? 
          `Winner: ${winner === 'X' ? 'You' : winner === 'O' ? 'AI' : 'Draw'}` : 
          isPlayerTurn ? 
            'Your turn' : 
            gameStatus === 'aiTurn' ? 
              'AI is thinking...' : 
              gameStatus === 'questionPhase' ?
                'Answer the question to continue' :
                'Game in progress'
        }
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
                    backgroundColor: board[rowIndex][colIndex] === null ? 
                      (isPlayerTurn && !winner ? 'rgba(224, 224, 224, 0.8)' : undefined) : 
                      (board[rowIndex][colIndex] === 'X' ? '#ff5252' : '#2196f3'),
                    boxShadow: isPlayerTurn && !winner && board[0][colIndex] === null ? 
                      `0 -5px 0 0 rgba(255, 82, 82, 0.5)` : 'none',
                    cursor: isPlayerTurn && !winner && board[0][colIndex] === null ? 'pointer' : undefined,
                  },
                  transition: 'all 0.3s ease',
                  animation: lastMove && lastMove.col === colIndex && lastMove.row === rowIndex ? 
                    'dropIn 0.5s ease-in-out' : undefined,
                }}
                onClick={() => handleColumnClick(colIndex)}
                disabled={!isPlayerTurn || winner || board[0][colIndex] !== null}
              />
            ))}
          </Box>
        ))}
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <Dialog 
        open={showQuestion} 
        onClose={() => {}}
        disableEscapeKeyDown
        sx={{
          '& .MuiDialog-paper': {
            width: '80%',
            maxWidth: '500px'
          }
        }}
      >
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

      {/* Add CSS animation */}
      <style jsx="true">{`
        @keyframes dropIn {
          0% { transform: translateY(-300px); }
          70% { transform: translateY(10px); }
          85% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}

export default ConnectFour; 