import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import TopNav from './components/TopNav';
import GameManager from './components/GameManager';
import TicTacToe from './components/games/TicTacToe';
import ConnectFour from './components/games/ConnectFour';
import GeometryRunner from './components/games/GeometryRunner';
import RestMode from './components/RestMode';
import ProgressSummary from './components/ProgressSummary';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <TopNav />
          <Routes>
            <Route path="/" element={<GameManager />} />
            <Route path="/tic-tac-toe" element={<GameManager initialGame="ticTacToe" />} />
            <Route path="/connect-four" element={<GameManager initialGame="connectFour" />} />
            <Route path="/geometry-runner" element={<GameManager initialGame="geometryRunner" />} />
            <Route path="/rest-mode" element={<RestMode />} />
            <Route path="/progress" element={<ProgressSummary />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 