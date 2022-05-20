import { Order } from 'coinbase-pro-node';

export type APICredentialsType = {
  name: string;
  key: string;
  secret: string;
  passphrase: string;
  isSandBox: boolean;
  isDefault: boolean;
};

export type CoinType = {
  price: number;
  size: number;
  balance: number;
  available: number;
  usd: number;
  percentage24h: number;
  orders: Order[];
  investment: number;
  currency: string;
  logo: string;
  difCalc?: {
    percentage: number;
  };
};
