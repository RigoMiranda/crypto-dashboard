import { Order } from 'coinbase-pro-node';
import { getClient } from './config';
import axios from 'axios';

// https://public.sandbox.pro.coinbase.com/orders/filled

type CalcType = {
  usd: number;
  percentage: number;
};

export class Coin {
  available: number;
  balance: number;
  currency: string;
  difCalc: CalcType | undefined;
  investment: number;
  openOrder?: Order | undefined;
  order?: Order | undefined;
  orders: Order[] | undefined;
  percentage24h: number;
  price: number;
  productID: string;
  size: number;
  usd: number;

  constructor(productID: string, currency: string) {
    this.available = 0.0;
    this.balance = 0.0;
    this.currency = `${currency}-USD`;
    this.investment = 0;
    this.percentage24h = 0.0;
    this.price = 0.0;
    this.productID = productID;
    this.size = 0.0;
    this.usd = 0;
  }

  init = async () => {
    const { data } = await axios.post(`/api/coinbase/coin`, {
      productID: this.productID,
      currency: this.currency,
    });

    this.available = data.available;
    this.balance = data.balance;
    this.difCalc = data.difCalc;
    this.investment = data.investment;
    this.orders = data.orders;
    this.percentage24h = data.percentage24h;
    this.price = data.price;
    this.size = data.size;
    this.usd = data.usd;
  };
}
