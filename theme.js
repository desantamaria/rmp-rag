'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#00921d',
      main: '#16a085',
      dark: '#0E6453',
      contrastText: '#fff',
    },
    secondary: {
      light: '#BFC9CA',
      main: '#B79C2F',
      dark: '#4D5656',
      contrastText: '#000',
    },
  },
});

export default theme;
