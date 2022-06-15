import React from 'react';
import { styled } from '@mui/material/styles';
import { Order } from 'coinbase-pro-node';
import {
  IconButton,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TableCell,
  tableCellClasses,
  Typography,
} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useAppContext } from '../../context/AppContext';
import moment from 'moment';
import { usdFormatter } from '../../utils';
import { calculatePercentageIncrease } from '../../vendors/utils';
import { CoinType } from '../../types';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const columns = ['Type', 'Executed Value', 'Size', 'Price', '%']; // 'Date'

export enum OrderTableEnum {
  active,
  history,
}

type OrderTableType = {
  coin: CoinType;
  type?: OrderTableEnum;
};

const PercentageOrder = ({
  coinCurrentValue,
  orderExecutedValue,
}: {
  coinCurrentValue: number;
  orderExecutedValue: number;
}) => {
  const value = calculatePercentageIncrease(coinCurrentValue, orderExecutedValue);
  return (
    <Typography variant="body1" color={value.percentage > 0 ? 'green' : 'red'}>
      {value.percentage.toFixed(3)}%
    </Typography>
  );
};

function OrdersTable({ coin, type = OrderTableEnum.history, ...props }: OrderTableType) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            {columns.map((titleCol, i) => (
              <StyledTableCell key={i}>{titleCol}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {coin.orders &&
            coin.orders?.map((order: Order) => (
              <StyledTableRow key={order.id}>
                <StyledTableCell component="th" scope="row">
                  {order.side}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {usdFormatter.format(Number(order.executed_value))}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {Number(order.size).toFixed(3)}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {usdFormatter.format(Number(order.price))}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  <PercentageOrder
                    coinCurrentValue={coin.price}
                    orderExecutedValue={Number(order.price)}
                  />
                </StyledTableCell>
                {/* <StyledTableCell component="th" scope="row">
                  {usdFormatter.format(Number(order.fill_fees))}
                </StyledTableCell> */}
                {/* <StyledTableCell component="th" scope="row">
                  {moment(order.created_at).format('MMM MM, YYYY')}
                </StyledTableCell> */}
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default React.memo(OrdersTable);
