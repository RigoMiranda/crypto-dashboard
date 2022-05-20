import { useState } from 'react';
import { sleep } from '../utils';
import axios from 'axios';
import { CoinType } from '../../types';

export const useTrader = () => {
  const [coins, setCoins] = useState<CoinType[]>([]);
  const [portfolio, setPortfolio] = useState<number>(0.0);
  const [usdAmount, setUsdAmount] = useState<number>(0.0);
  const [usdId, setUsdId] = useState<string | undefined>();

  const updateTrader = async () => {
    const { coins: coinsData, portfolio: tempPortfolio, usdId, usdAmount } = await getAccounts();
    if (!coins) return;
    setUsdId(usdId);
    setUsdAmount(Number(usdAmount));
    setCoins([...coinsData]);
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
    await updateTrader();
    await sleep(8000);
  };

  return {
    coins,
    portfolio,
    usdAmount,
    usdId,
    updateTrader,
    trade,
  };
};
