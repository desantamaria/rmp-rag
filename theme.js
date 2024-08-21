'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#00921d',
      main: '#00921d',
      dark: '#00921d',
      contrastText: '#fff',
    },
    secondary: {
      light: '#BFC9CA',
      main: '#839192',
      dark: '#4D5656',
      contrastText: '#000',
    },
  },
});

export default theme;
