import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import GameManager from './components/GameManager';
import Navbar from './components/Navbar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7b2cbf',
    },
    secondary: {
      main: '#e0aaff',
    },
    background: {
      default: '#f9fafb',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

// Add CSS variables for gradient colors
document.documentElement.style.setProperty('--primary-color', '#7b2cbf');
document.documentElement.style.setProperty('--secondary-color', '#5a189a');

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/geometry-runner" replace />} />
          <Route path="/tic-tac-toe" element={<GameManager game="tic-tac-toe" />} />
          <Route path="/connect-four" element={<GameManager game="connect-four" />} />
          <Route path="/geometry-runner" element={<GameManager game="geometry-runner" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 