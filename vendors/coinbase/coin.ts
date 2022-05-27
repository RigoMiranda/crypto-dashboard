import { Order, OrderStatus } from 'coinbase-pro-node';
import { getClient } from './config';
import { calculatePercentageIncrease } from '../../vendors/utils';

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

    return orders.data;
  } catch (error: any) {
    // Log Error Message
    console.log(error.response?.data?.message);
    return [];
  }
};

const calculateInvestment = (orders: Order[]): number | undefined => {
  try {
    let investment = 0;
    for (const o of orders) {
      if (o.side === 'sell') investment -= Number(o.executed_value);
      if (o.side === 'buy') investment += Number(o.executed_value);
    }

    return investment;
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

const Coin = async (productID: string, currency: string) => {
  try {
    let tempPrice = 0.0;
    let tempSize = 0.0;
    let tempBalance = 0.0;
    let tempAvailable = 0.0;
    let tempUsd = 0.0;
    let tempPercentage24h = 0.0;
    let difCalc = {};

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
    tempPercentage24h = calculatePercentageIncrease(price, Number(stats?.open)).percentage;

    const orders = await getOrders(currency, [OrderStatus.DONE]);

    const investment = calculateInvestment(orders) || 0.0;
    if (orders) {
      const order = orders[0];
      if (order) {
        difCalc = calculatePercentageIncrease(price, Number(order?.price));
      }
    }

    return {
      available: tempAvailable,
      balance: tempBalance,
      difCalc,
      investment,
      orders,
      percentage24h: tempPercentage24h,
      price: tempPrice,
      size: tempSize,
      usd: tempUsd,
    };
  } catch (error) {
    console.error(error);
    return {};
  }
};

export default Coin;
