import React from 'react';
import { Box, AppBar, Toolbar, Typography, Stack } from '@mui/material';
import Content from './Content';
import { useAppContext } from '../context/AppContext';
import { usdFormatter } from '../utils';

export default function Body() {
  const { trader } = useAppContext();
  return (
    <Box flex={1} display="flex" minHeight="90vh" flexDirection="column">
      <AppBar color="primary" position="static" elevation={0} sx={{ zIndex: 0 }}>
        <Toolbar>
          <Stack spacing={0} height={100} justifyContent="center">
            <Typography color="inherit" variant="h5">
              Portfolio {usdFormatter.format(trader?.portfolio)}
            </Typography>
            <Typography variant="body1">
              USD Balance {usdFormatter.format(trader?.usdAmount)}
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>
      <Content />
    </Box>
  );
}
