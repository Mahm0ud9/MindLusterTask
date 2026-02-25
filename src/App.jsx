import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import BoardPage from './pages/BoardPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5',
    },
    secondary: {
      main: '#F97316',
    },
    background: {
      default: '#F3F4F6',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'system-ui',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <BoardPage />
      </Box>
    </ThemeProvider>
  );
}

export default App;
