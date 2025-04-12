import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, CircularProgress, Paper, Grid } from '@mui/material';

function ProgressSummary() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
          navigate('/');
          return;
        }

        const user = JSON.parse(savedUser);
        const response = await fetch(`http://localhost:5000/api/users/${user.username}/progress`);
        
        if (response.ok) {
          const data = await response.json();
          setProgress(data);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!progress) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          No Progress Data Available
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/')}>
          Return to Games
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Your Learning Progress
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tic Tac Toe
            </Typography>
            <Typography>Wins: {progress.ticTacToe.wins}</Typography>
            <Typography>Losses: {progress.ticTacToe.losses}</Typography>
            <Typography>Questions Answered: {progress.ticTacToe.questionsAnswered}</Typography>
            <Typography>Correct Answers: {progress.ticTacToe.correctAnswers}</Typography>
            <Typography>
              Accuracy: {progress.ticTacToe.questionsAnswered > 0 
                ? `${Math.round((progress.ticTacToe.correctAnswers / progress.ticTacToe.questionsAnswered) * 100)}%`
                : 'N/A'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Connect Four
            </Typography>
            <Typography>Wins: {progress.connectFour.wins}</Typography>
            <Typography>Losses: {progress.connectFour.losses}</Typography>
            <Typography>Questions Answered: {progress.connectFour.questionsAnswered}</Typography>
            <Typography>Correct Answers: {progress.connectFour.correctAnswers}</Typography>
            <Typography>
              Accuracy: {progress.connectFour.questionsAnswered > 0 
                ? `${Math.round((progress.connectFour.correctAnswers / progress.connectFour.questionsAnswered) * 100)}%`
                : 'N/A'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Geometry Runner
            </Typography>
            <Typography>High Score: {progress.geometryRunner.highScore}</Typography>
            <Typography>Questions Answered: {progress.geometryRunner.questionsAnswered}</Typography>
            <Typography>Correct Answers: {progress.geometryRunner.correctAnswers}</Typography>
            <Typography>
              Accuracy: {progress.geometryRunner.questionsAnswered > 0 
                ? `${Math.round((progress.geometryRunner.correctAnswers / progress.geometryRunner.questionsAnswered) * 100)}%`
                : 'N/A'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Button variant="contained" color="primary" onClick={() => navigate('/')}>
          Return to Games
        </Button>
      </Box>
    </Container>
  );
}

export default ProgressSummary; 