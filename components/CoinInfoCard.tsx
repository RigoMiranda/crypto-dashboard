import React, { Fragment } from 'react';
import { Coin } from '../vendors/coinbase';
import { usdFormatter } from '../utils';
import { useAppContext } from '../context/AppContext';
import {
  Stack,
  Grid,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Orders from './Orders';

export const CoinCard = ({ coin }: { coin: Coin }) => {
  return (
    <Box display="flex" flex={1} flexDirection={{ xs: 'column', sm: 'row' }}>
      <Stack spacing={2} pb={2}>
        <Typography color="text.secondary">{coin.currency}</Typography>
        <Stack>
          <Typography color="text.secondary" variant="caption">
            Balance
          </Typography>
          <Typography variant="h5">{usdFormatter.format(coin.usd)}</Typography>
        </Stack>
      </Stack>
      <Grid
        display="flex"
        flex={1}
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        p={{ xs: 0, sm: 4 }}
      >
        <Stack>
          <Typography color="text.secondary" variant="caption">
            Investment
          </Typography>
          <Typography color={coin.investment < coin.usd ? 'green' : 'red'} variant="body1">
            {usdFormatter.format(coin.investment)}
          </Typography>
        </Stack>
        {coin?.difCalc && (
          <Stack>
            <Typography color="text.secondary" variant="caption">
              Last Order
            </Typography>
            <Typography variant="body1" color={coin?.difCalc?.percentage > 0 ? 'green' : 'red'}>
              {coin?.difCalc?.percentage.toFixed(2)}%
            </Typography>
          </Stack>
        )}
        <Stack>
          <Typography color="text.secondary" variant="caption">
            Last 24h
          </Typography>
          <Typography variant="body1" color={coin.percentage24h > 0 ? 'green' : 'red'}>
            {coin.percentage24h.toFixed(2)}%
          </Typography>
        </Stack>
        <Stack>
          <Typography textAlign="center" color="text.secondary" variant="caption">
            Price
          </Typography>
          <Typography variant="body1">{usdFormatter.format(coin.price)}</Typography>
        </Stack>
      </Grid>
    </Box>
  );
};

const CoinInfoCard = () => {
  const { coins } = useAppContext();

  return (
    <Fragment>
      {coins?.map((coin: Coin, i: number) => (
        <Box mb={2} key={i}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <CoinCard key={i} coin={coin} />
            </AccordionSummary>
            <AccordionDetails>
              <Orders coin={coin} />
            </AccordionDetails>
          </Accordion>
        </Box>
      ))}
    </Fragment>
  );
};

export default CoinInfoCard;
