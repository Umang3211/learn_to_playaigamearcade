import React, { useState } from 'react';
import { Box, Button, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';

function QuestionDisplay({ question, options = {}, correctAnswer, onAnswer }) {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);

  // Log props for debugging
  console.log('QuestionDisplay props:', { question, options, correctAnswer });

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    const isCorrect = selectedAnswer === correctAnswer;
    setHasAnswered(true);
    onAnswer?.(isCorrect);
  };

  if (!question || !options) {
    console.log('Loading or invalid question data:', { question, options });
    return (
      <Box sx={{ p: 3, minWidth: 300 }}>
        <Typography>Loading question...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, minWidth: 300 }}>
      <Typography variant="h6" gutterBottom>
        {question}
      </Typography>
      
      <RadioGroup
        value={selectedAnswer}
        onChange={(e) => setSelectedAnswer(e.target.value)}
      >
        {Object.entries(options).map(([key, value]) => (
          <FormControlLabel
            key={key}
            value={key}
            control={<Radio />}
            label={`${key}) ${value}`}
            disabled={hasAnswered}
          />
        ))}
      </RadioGroup>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!selectedAnswer || hasAnswered}
        sx={{ mt: 2 }}
      >
        Submit Answer
      </Button>

      {hasAnswered && (
        <Typography
          sx={{ mt: 2 }}
          color={selectedAnswer === correctAnswer ? 'success.main' : 'error.main'}
        >
          {selectedAnswer === correctAnswer ? 'Correct!' : 'Incorrect. Try again!'}
        </Typography>
      )}
    </Box>
  );
}

export default QuestionDisplay; 