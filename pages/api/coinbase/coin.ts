import { NextApiRequest, NextApiResponse } from 'next';
import { Order, OrderStatus } from 'coinbase-pro-node';
import { getClient } from '../../../vendors/coinbase/config';
import { calculateDifference } from '../../../vendors/utils';

const client = getClient();

const getTicker = async (currency: string) => {
  try {
    const ticker = await client?.rest.product.getProductTicker(currency);
    return ticker;
  } catch (error: any) {
    // Log Error Message
    console.log(error?.response?.data?.message);
    return null;
  }
};

const get24Hours = async (currency: string) => {
  try {
    const stats = await client?.rest.product.getProductStats(currency);
    return stats;
  } catch (error: any) {
    // Log Error Message
    console.log(error?.response?.data?.message);
    return null;
  }
};

const getOrders = async (currency: string, status: (OrderStatus | 'all')[] = ['all']) => {
  try {
    const orders = await client?.rest.order.getOrders({
      product_id: currency,
      status,
    });
    return orders;
  } catch (error: any) {
    // Log Error Message
    console.log(error.response?.data?.message);
  }
};

const getAllOrders = async (currency: string): Promise<any> => {
  try {
    const orders = await getOrders(currency);
    const tempOrders = orders?.data as Order[];
    /* Calculate Current Investment Amount*/
    let investment = 0;
    for (const o of tempOrders) {
      if (o.side === 'sell') investment -= Number(o.executed_value);
      if (o.side === 'buy') investment += Number(o.executed_value);
    }

    return {
      orders: tempOrders,
      investment,
    };
  } catch (error: any) {
    // Log Error Message
    console.log(error.response?.data?.message);
  }
};

const getAccount = async (accountID: string) => {
  try {
    const account = await client?.rest.account.getAccount(accountID);
    return account;
  } catch (error: any) {
    // Log Error Message
    console.log(error.response?.data?.message);
    return null;
  }
};

const Coin = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { productID, currency } = req.body;
    let tempPrice = 0.0;
    let tempSize = 0.0;
    let tempBalance = 0.0;
    let tempAvailable = 0.0;
    let tempUsd = 0.0;
    let tempPercentage24h = 0.0;
    let investment = 0.0;
    let difCalc = {};
    let orders = [];

    //@ts-ignore
    const { price, size } = await getTicker(currency);
    //@ts-ignore
    const { balance, available } = await getAccount(productID);
    const stats = await get24Hours(currency);
    tempPrice = Number(price);
    tempSize = Number(size);
    tempBalance = Number(balance);
    tempAvailable = Number(available);
    tempUsd = price * available;
    tempPercentage24h = calculateDifference(price, Number(stats?.open)).percentage;

    const ordersData = await getAllOrders(currency);
    orders = ordersData.orders;
    investment = ordersData.investment;
    if (ordersData?.orders) {
      const order = ordersData?.orders[0];
      if (order) {
        difCalc = calculateDifference(price, Number(order?.price));
      }
    }

    res.status(200).json({
      price: tempPrice,
      size: tempSize,
      balance: tempBalance,
      available: tempAvailable,
      usd: tempUsd,
      percentage24h: tempPercentage24h,
      orders,
      investment,
      difCalc,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: `Unexpected Error: ${error}` });
  }
};

export default Coin;
