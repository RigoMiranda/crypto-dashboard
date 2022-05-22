import React from 'react';
import { Box } from '@mui/material';
import CoinInfoCard from './CoinInfoCard';

export default function Content() {
  return (
    <Box p={2} justifyContent="center" bgcolor="secondary">
      <CoinInfoCard />
    </Box>
  );
}
