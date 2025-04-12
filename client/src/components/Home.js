import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';

function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          AI Game Arcade
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Educational Games for K-12 Students
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/games')}
          sx={{ mt: 3 }}
        >
          Start Playing
        </Button>
      </Box>
    </Container>
  );
}

export default Home; 