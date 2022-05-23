import { createTheme } from '@mui/material/styles';

export const drawerWidth = 256;

// Create a theme instance.
export const theme = createTheme({
  palette: {
    // mode: 'dark',
    primary: {
      main: '#041C32',
      dark: '#041C32',
    },
    secondary: {
      main: '#04293A',
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme.components = {
  MuiTableHead: {
    styleOverrides: {
      root: {
        marginLeft: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.common.white,
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: 4,
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        width: 32,
        height: 32,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundColor: '#fdfdfd',
      },
    },
  },
};
