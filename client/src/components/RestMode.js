import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function RestMode() {
  const [motivationalContent, setMotivationalContent] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading motivational content
    const timer = setTimeout(() => {
      setMotivationalContent("Take a deep breath and remember: Every challenge is an opportunity to grow!");
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Rest Mode
        </Typography>
        
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Typography variant="body1" sx={{ fontSize: '1.2rem', lineHeight: 1.6 }}>
                {motivationalContent}
              </Typography>
            )}
          </CardContent>
        </Card>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          onClick={() => navigate('/')}
        >
          Return to Games
        </Button>
      </Box>
    </Container>
  );
}

export default RestMode; 