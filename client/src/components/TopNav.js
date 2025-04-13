import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton 
          color="inherit" 
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          <HomeIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AI Game Arcade
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {user && (
            <>
              <Typography variant="body1" sx={{ alignSelf: 'center' }}>
                Welcome, {user.username} (Grade {user.gradeLevel})
              </Typography>
              <Button 
                color="inherit" 
                onClick={() => navigate('/progress')}
                sx={{ 
                  backgroundColor: isActive('/progress') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }
                }}
              >
                Progress
              </Button>
              <Button 
                color="inherit" 
                onClick={handleLogout}
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }
                }}
              >
                Logout
              </Button>
            </>
          )}
          
          <Button 
            color="inherit" 
            onClick={() => navigate('/tic-tac-toe')}
            sx={{ 
              backgroundColor: isActive('/tic-tac-toe') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            Tic Tac Toe
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/connect-four')}
            sx={{ 
              backgroundColor: isActive('/connect-four') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            Connect Four
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/geometry-runner')}
            sx={{ 
              backgroundColor: isActive('/geometry-runner') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            Geometry Runner
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopNav; 