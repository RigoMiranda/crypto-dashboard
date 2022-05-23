import React from 'react';
import { Box, AppBar, Toolbar, Typography, Stack, Paper } from '@mui/material';
import CoinInfoCard from './CoinInfoCard';
import { useAppContext } from '../context/AppContext';
import { usdFormatter } from '../utils';

export default function Body() {
  const { portfolio, usdAmount } = useAppContext();
  return (
    <Paper>
      <Box flex={1} display="flex" minHeight="100vh" flexDirection="column">
        <AppBar color="primary" position="static" elevation={0} sx={{ zIndex: 0 }}>
          <Toolbar>
            <Stack spacing={0} height={100} justifyContent="center">
              <Typography color="inherit" variant="h5">
                Portfolio {usdFormatter.format(portfolio)}
              </Typography>
              <Typography variant="body1">USD Balance {usdFormatter.format(usdAmount)}</Typography>
            </Stack>
          </Toolbar>
        </AppBar>
        <CoinInfoCard />
      </Box>
    </Paper>
  );
}
