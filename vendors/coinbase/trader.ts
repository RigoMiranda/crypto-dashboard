import { useState } from 'react';
import CoinbasePro, { Account } from 'coinbase-pro-node';
import { Coin } from '.';
import { sleep } from '../utils';
import { getClient } from './config';

export const useTrader = () => {
  const client: CoinbasePro = getClient();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [portfolio, setPortfolio] = useState<number>(0.0);
  const [usdAmount, setUsdAmount] = useState<number>(0.0);
  const [usdId, setUsdId] = useState<string | undefined>();

  const updateTrader = async () => {
    const accountsData = await getAccounts();
    if (!accountsData) return;
    let tempAccounts = [];
    let tempCoins = [];
    let tempPortfolio = 0.0;
    for (const account of accountsData) {
      if (account.available !== '0') {
        if (account.currency === 'USD') {
          setUsdId(account.id);
          setUsdAmount(Number(account.available));
        } else {
          tempAccounts.push(account);
          const coin = new Coin(account.id, account.currency);
          await coin.init();
          tempPortfolio += coin.usd;
          tempCoins.push(coin);
        }
      }
    }

    tempPortfolio += usdAmount;
    tempCoins = tempCoins.sort((a, b) => b.usd - a.usd);

    setAccounts(tempAccounts);
    setCoins(tempCoins);
    setPortfolio(tempPortfolio);
  };

  const getAccounts = async () => {
    try {
      const accounts = await client?.rest.account.listAccounts();
      return accounts;
    } catch (error: any) {
      // Log Error Message
      console.log(error.response?.data?.message);
      return null;
    }
  };

  const trade = async () => {
    await sleep(8000);
    await updateTrader();
  };

  return {
    accounts,
    coins,
    portfolio,
    usdAmount,
    usdId,
    updateTrader,
    trade,
  };
};
