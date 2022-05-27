import { Order } from 'coinbase-pro-node';

export type APICredentialsType = {
  name: string;
  key: string;
  secret: string;
  passphrase: string;
  isSandBox: boolean;
  isDefault: boolean;
};

// export type OrderType = {
//   difPercentage: number;
// } & Order;

export type CoinType = {
  available: number;
  activeBuyingOrders: Order[];
  balance: number;
  coinBalance: number;
  currency: string;
  difCalc?: {
    percentage: number;
  };
  doneBuyingOrders: Order[];
  investment: number;
  logo: string;
  orders: Order[];
  percentage24h: number;
  price: number;
  size: number;
  usd: number;
};
