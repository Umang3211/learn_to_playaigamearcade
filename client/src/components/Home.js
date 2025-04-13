import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ConnectFourIcon from '@mui/icons-material/ViewInAr';
import GeometryIcon from '@mui/icons-material/ShapeLine';

const games = [
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    description: 'Classic game of Xs and Os with AI opponent',
    icon: <SportsEsportsIcon sx={{ fontSize: 100, color: 'primary.main' }} />
  },
  {
    id: 'connect-four',
    title: 'Connect Four',
    description: 'Strategic game of connecting four discs',
    icon: <ConnectFourIcon sx={{ fontSize: 100, color: 'primary.main' }} />
  },
  {
    id: 'geometry-runner',
    title: 'Geometry Runner',
    description: 'Fast-paced geometry learning game',
    icon: <GeometryIcon sx={{ fontSize: 100, color: 'primary.main' }} />
  }
];

function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Welcome to AI Game Arcade
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
        Choose a game to play and learn
      </Typography>
      
      <Grid container spacing={4}>
        {games.map((game) => (
          <Grid item xs={12} sm={6} md={4} key={game.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              <Box 
                sx={{ 
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'background.paper'
                }}
              >
                {game.icon}
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {game.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {game.description}
                </Typography>
                <Box sx={{ mt: 'auto' }}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => navigate(`/${game.id}`)}
                  >
                    Play Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home; 