import CoinbasePro, { NewOrder, Order, OrderSide, OrderStatus, OrderType } from 'coinbase-pro-node';
import { getClient } from './config';
import { calculateDifference } from '../utils';

// https://public.sandbox.pro.coinbase.com/orders/filled

export const FEE_PERCENT = 0.05;
export const MAX_LOST_THRESHOLD = 5.0;
const MIN_THRESHOLD = 1.5;

type CalcType = {
  usd: number;
  percentage: number;
};

export class Coin {
  productID: string;
  currency: string;
  price: number;
  size: number;
  available: number;
  balance: number;
  usd: number;
  buyBellow: number;
  order?: Order | undefined;
  openOrder?: Order | undefined;
  orders: Order[] | undefined;
  difCalc: CalcType | undefined;
  percentage24h: number;
  investment: number;
  private client: CoinbasePro | undefined;

  constructor(productID: string, currency: string) {
    this.productID = productID;
    this.currency = `${currency}-USD`;
    this.buyBellow = 1;
    this.client = getClient();
    this.price = 0.0;
    this.size = 0.0;
    this.available = 0.0;
    this.balance = 0.0;
    this.usd = 0;
    this.percentage24h = 0.0;
    this.investment = 0;
  }

  init = async () => {
    // TODO: Load Data from DB?

    // Get Current Price:
    await this.setCoin();
  };

  setCoin = async () => {
    try {
      //@ts-ignore
      const { price, size } = await this.getTicker();
      //@ts-ignore
      const { balance, available } = await this.getAccount(this.productID);
      const stats = await this.get24Hours();
      this.price = Number(price);
      this.size = Number(size);
      this.balance = Number(balance);
      this.available = Number(available);
      this.usd = this.price * this.available;
      this.percentage24h = calculateDifference(this.price, Number(stats?.open)).percentage;

      /* Get the Latest Open/Acive/Pending Order */
      await this.getOpenOrders();
      if (!this.openOrder) {
        await this.getAllOrders();
        if (this?.orders) {
          this.order = this.orders[0];
        }
      }

      if (this.openOrder || this.order) {
        this.difCalc = calculateDifference(
          this.price,
          Number(this?.openOrder?.price || this?.order?.price)
        );
      }
    } catch (error: any) {
      // Log Error Message
      console.log(error?.response?.data?.message);
      return null;
    }
  };

  getTicker = async () => {
    try {
      const ticker = await this.client?.rest.product.getProductTicker(this.currency);
      return ticker;
    } catch (error: any) {
      // Log Error Message
      console.log(error?.response?.data?.message);
      return null;
    }
  };

  get24Hours = async () => {
    try {
      const stats = await this.client?.rest.product.getProductStats(this.currency);
      return stats;
    } catch (error: any) {
      // Log Error Message
      console.log(error?.response?.data?.message);
      return null;
    }
  };

  buyMarket = async (funds: string) => {
    console.log('Placing Buy Market Order', this.currency, funds);
    await this.placeOrder({
      type: OrderType.MARKET,
      side: OrderSide.BUY,
      product_id: this.currency,
      funds,
    });
  };

  sellMarket = async (funds: string) => {
    console.log('Placing Sell Market Order', this.currency, funds);
    await this.placeOrder({
      type: OrderType.MARKET,
      side: OrderSide.SELL,
      product_id: this.currency,
      funds,
    });
  };

  buyLimit = async (size: string) => {
    console.log('Placing Buy Limit Order', this.currency, this.price, size);
    await this.placeOrder({
      type: OrderType.LIMIT,
      side: OrderSide.BUY,
      product_id: this.currency,
      size,
      price: `${this.price}`,
    });
  };

  sellLimit = async (size: string) => {
    console.log('Placing Sell Limit Order', this.currency, this.price, size);
    await this.placeOrder({
      type: OrderType.LIMIT,
      side: OrderSide.SELL,
      product_id: this.currency,
      price: `${this.price}`,
      size,
    });
  };

  shouldIBuy = (): boolean => {
    if (!this.openOrder || !this.difCalc) {
      console.log(`There are no orders for ${this.currency}, let's try to buy...`);
      return true;
    }

    if (this.openOrder.side === 'buy') return false;

    if (this.difCalc.percentage < -MIN_THRESHOLD) {
      console.log(`Do Not Buy ${this.currency}, ${this.difCalc.percentage}% < -${MIN_THRESHOLD}%`);
      return false;
    } else {
      console.log(`Buy ${this.currency} Now, is down ${this?.difCalc?.percentage}%`);
      return true;
    }
  };

  shouldISell = (): boolean => {
    if (!this.openOrder && this.difCalc) {
      if (this.available > 0 && this.difCalc.percentage > MIN_THRESHOLD) {
        console.log(
          `No open orders for ${this.currency}, and ${this?.difCalc?.percentage} > ${MIN_THRESHOLD}`
        );
        return true;
      }
      console.log(
        `No orders for ${this.currency}, but ${this?.difCalc?.percentage} < ${MIN_THRESHOLD}`
      );
      return false;
    }

    if (this.openOrder && this?.difCalc && this.difCalc.percentage < MIN_THRESHOLD) {
      console.log(`Do Not Sell, ${this?.difCalc?.percentage}% < ${MIN_THRESHOLD}%`);
      return false;
    } else {
      console.log(`Sell ${this.currency} Now, is ${this?.difCalc?.percentage}%`);
      return true;
    }
  };

  private placeOrder = async (order: NewOrder) => {
    try {
      const transaction = await this.client?.rest.order.placeOrder(order);
      // Store Transaction in DB?
      this.openOrder = transaction;
    } catch (error: any) {
      // Log Error Message
      console.log(`Order Error: ${error?.response.data?.message}. Order: ${JSON.stringify(order)}`);
      return null;
    }
  };

  getOrder = async (): Promise<void> => {
    if (!this.openOrder) return;

    try {
      const order = await this.client?.rest.order.getOrder(this.openOrder.id);
      this.openOrder = order as Order;
    } catch (error: any) {
      // Log Error Message
      console.log(error.response?.data?.message);
    }
  };

  getOrders = async (status: (OrderStatus | 'all')[] = ['all']) => {
    try {
      const orders = await this.client?.rest.order.getOrders({
        product_id: this.currency,
        status,
      });
      return orders;
    } catch (error: any) {
      // Log Error Message
      console.log(error.response?.data?.message);
    }
  };

  getOpenOrders = async (): Promise<void> => {
    try {
      const orders = await this.getOrders([
        OrderStatus.PENDING,
        OrderStatus.OPEN,
        OrderStatus.ACTIVE,
      ]);
      if (!orders?.data) {
        this.openOrder = undefined;
        this.difCalc = undefined;
      }
      this.openOrder = orders?.data[0];
    } catch (error: any) {
      // Log Error Message
      console.log(error.response?.data?.message);
    }
  };

  getAllOrders = async (): Promise<void> => {
    try {
      const orders = await this.getOrders();
      this.orders = orders?.data as Order[];

      /* Calculate Current Investment Amount*/
      this.investment = 0;
      for (const o of this.orders) {
        if (o.side === 'sell') this.investment -= Number(o.executed_value);
        if (o.side === 'buy') this.investment += Number(o.executed_value);
      }
    } catch (error: any) {
      // Log Error Message
      console.log(error.response?.data?.message);
    }
  };

  getAccount = async (accountID: string) => {
    try {
      const account = await this.client?.rest.account.getAccount(accountID);
      return account;
    } catch (error: any) {
      // Log Error Message
      console.log(error.response?.data?.message);
      return null;
    }
  };

  // TODO: Analyze coin price in the last X hours/days/weeks
}
