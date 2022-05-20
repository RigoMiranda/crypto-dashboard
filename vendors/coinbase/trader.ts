import { useState } from 'react';
import { Account } from 'coinbase-pro-node';
import { Coin } from '.';
import { sleep } from '../utils';
import axios from 'axios';

export const useTrader = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [portfolio, setPortfolio] = useState<number>(0.0);
  const [usdAmount, setUsdAmount] = useState<number>(0.0);
  const [usdId, setUsdId] = useState<string | undefined>();

  const updateTrader = async () => {
    const { accounts: accountsData, usdId, usdAmount } = await getAccounts();
    if (!accountsData) return;
    let tempCoins = [];
    let tempPortfolio = 0.0;
    for (const account of accountsData) {
      const coin = new Coin(account.id, account.currency);
      await coin.init();
      tempPortfolio += coin.usd;
      tempCoins.push(coin);
    }

    tempPortfolio += usdAmount;
    tempCoins = tempCoins.sort((a, b) => b.usd - a.usd);

    setUsdId(usdId);
    setUsdAmount(Number(usdAmount));
    setAccounts(accountsData);
    setCoins(tempCoins);
    setPortfolio(tempPortfolio);
  };

  const getAccounts = async () => {
    try {
      const { data } = await axios.post(`/api/coinbase/accounts`);
      return data;
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
