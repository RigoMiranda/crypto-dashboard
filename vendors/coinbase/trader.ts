import CoinbasePro, { Account } from 'coinbase-pro-node';
import { Coin } from '.';
import { sleep } from '../utils';
import { getClient } from './config';

export class Trader {
  accounts: Account[];
  coins: Coin[];
  usdID: string | undefined;
  usdAmount: number;
  isTrading: boolean;
  setTrader: any;
  portfolio: number;
  private client: CoinbasePro | undefined;

  constructor() {
    this.accounts = [];
    this.coins = [];
    this.usdAmount = 0.0;
    this.portfolio = 0.0;
    this.isTrading = false;
    this.client = getClient();
  }

  init = async () => {
    // TODO: Load Data from DB?
    // Get Trader Data:
    await this.updateTrader();
  };

  updateTrader = async () => {
    const accounts = await this.getAccounts();
    if (!accounts) return;
    this.accounts = [];
    this.coins = [];
    this.portfolio = 0.0;
    for (const account of accounts) {
      if (account.available !== '0') {
        if (account.currency === 'USD') {
          this.usdID = account.id;
          this.usdAmount = Number(account.available);
        } else {
          this.accounts.push(account);
          const coin = new Coin(account.id, account.currency);
          await coin.init();
          this.portfolio += coin.usd;
          this.coins.push(coin);
        }
      }
    }
    this.portfolio += this.usdAmount;
    this.coins = this.coins.sort((a, b) => b.usd - a.usd);
    this.setTrader({ ...this });
  };

  getAccounts = async () => {
    try {
      const accounts = await this.client?.rest.account.listAccounts();
      return accounts;
    } catch (error: any) {
      // Log Error Message
      console.log(error.response?.data?.message);
      return null;
    }
  };

  trade = async () => {
    // for (const coin of this.coins) {
    //   await this.analyzer(coin);
    // }
    await sleep(10000);
  };
}
