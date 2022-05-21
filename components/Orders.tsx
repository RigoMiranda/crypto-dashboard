import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CoinType } from '../types';
import OrdersTable from './Table/OrdersTable';

const Orders = ({ coin }: { coin: CoinType }) => {
  return (
    <Box>
      {!coin?.orders || coin?.orders?.length === 0 ? (
        <Typography color="gray" align="center">
          No Orders
        </Typography>
      ) : (
        <OrdersTable orders={coin?.orders} />
      )}
    </Box>
  );
};

export default Orders;
