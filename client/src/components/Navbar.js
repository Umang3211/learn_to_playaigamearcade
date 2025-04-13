import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import Logo from './Logo';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const buttonStyle = (path) => ({
    mx: 1,
    color: 'white',
    fontWeight: 600,
    background: isActive(path) ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    '&:hover': {
      background: isActive(path) ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
    }
  });

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #7b2cbf, #5a189a)' }}>
      <Toolbar>
        <IconButton 
          component={Link} 
          to="/" 
          color="inherit" 
          sx={{ mr: 2 }}
          aria-label="home"
        >
          <HomeIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Logo height={40} showText={true} />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            component={Link} 
            to="/tic-tac-toe" 
            startIcon={<SportsEsportsIcon />}
            sx={buttonStyle("/tic-tac-toe")}
          >
            Tic Tac Toe
          </Button>
          
          <Button 
            component={Link} 
            to="/connect-four" 
            startIcon={<SportsEsportsIcon />}
            sx={buttonStyle("/connect-four")}
          >
            Connect Four
          </Button>
          
          <Button 
            component={Link} 
            to="/geometry-runner" 
            startIcon={<SportsEsportsIcon />}
            sx={buttonStyle("/geometry-runner")}
          >
            Geometry Runner
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 