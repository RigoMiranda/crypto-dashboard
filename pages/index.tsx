import React from 'react';
import type { NextPage } from 'next';

import Box from '@mui/material/Box';
import Body from '../components/Body';

const Home: NextPage = () => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Body />
    </Box>
  );
};

export default Home;
