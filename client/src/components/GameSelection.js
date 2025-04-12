import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardContent, CardActions, Button, Typography } from '@mui/material';

const games = [
  {
    id: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    description: 'Classic game with AI opponent and educational questions',
    path: '/games/tic-tac-toe'
  },
  {
    id: 'connect-four',
    name: 'Connect Four',
    description: 'Strategic game with AI opponent and educational challenges',
    path: '/games/connect-four'
  },
  {
    id: 'geometry-runner',
    name: 'Geometry Runner',
    description: 'Fun running game with geometry-based obstacles',
    path: '/games/geometry-runner'
  }
];

function GameSelection() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Choose a Game
      </Typography>
      <Grid container spacing={3}>
        {games.map((game) => (
          <Grid item xs={12} sm={6} md={4} key={game.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {game.name}
                </Typography>
                <Typography color="textSecondary">
                  {game.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(game.path)}
                >
                  Play {game.name}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default GameSelection; 