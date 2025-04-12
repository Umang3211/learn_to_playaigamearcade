import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

function TopNav() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AI Game Arcade
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {user && (
            <>
              <Typography variant="body1" sx={{ alignSelf: 'center' }}>
                Welcome, {user.username} (Grade {user.gradeLevel})
              </Typography>
              <Button color="inherit" onClick={() => navigate('/progress')}>
                Progress
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
          
          <Button color="inherit" onClick={() => navigate('/tic-tac-toe')}>
            Tic Tac Toe
          </Button>
          <Button color="inherit" onClick={() => navigate('/connect-four')}>
            Connect Four
          </Button>
          <Button color="inherit" onClick={() => navigate('/geometry-runner')}>
            Geometry Runner
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopNav; 