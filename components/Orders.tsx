import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OrdersTable from './Table/OrdersTable';
import { Coin } from '../vendors/coinbase';

const Orders = ({ coin }: { coin: Coin }) => {
  return (
    <Box>
      {!coin?.orders || coin?.orders?.length === 0 ? (
        <Typography color="gray" align="center">
          No Orders
        </Typography>
      ) : (
        <OrdersTable title="Orders History" orders={coin?.orders} />
      )}
    </Box>
  );
};

export default Orders;
