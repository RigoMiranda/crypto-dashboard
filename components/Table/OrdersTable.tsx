import React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Order } from 'coinbase-pro-node';
import { Box, IconButton, Typography } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useAppContext } from '../../context/AppContext';
import moment from 'moment';
import { usdFormatter } from '../../utils';

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

const columns = ['Type', 'Executed Value', 'Price', 'Size', 'Date'];

export enum OrderTableEnum {
  active,
  history,
}

type OrderTableType = {
  orders: Order[];
  type?: OrderTableEnum;
};

export default function OrdersTable({
  orders,
  type = OrderTableEnum.history,
}: OrderTableType) {
  const { trader } = useAppContext();

  const handleCancelTransaction = async (transactionId: string) => {
    await trader.cancelOrder(transactionId);
  };
  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            {columns.map((titleCol, i) => (
              <StyledTableCell key={i} align="center">
                {titleCol}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders &&
            orders?.map((order: Order) => (
              <StyledTableRow key={order.id}>
                <StyledTableCell component="th" scope="row" align="center">
                  {order.side}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="center">
                  {usdFormatter.format(Number(order.executed_value))}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="center">
                  {Number(order.size).toFixed(3)}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="center">
                  {usdFormatter.format(Number(order.price))}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="center">
                  {moment(order.created_at).format('MMM MM, YYYY')}
                </StyledTableCell>
                {type === OrderTableEnum.active && (
                  <StyledTableCell component="th" scope="row" align="center">
                    <IconButton onClick={() => handleCancelTransaction(order.id)}>
                      <HighlightOffIcon />
                    </IconButton>
                  </StyledTableCell>
                )}
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
