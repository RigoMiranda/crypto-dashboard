import axios from 'axios';
import { useState } from 'react';
import { sleep } from '../utils';
import { CoinType } from '../../types';

export const useAccount = () => {
  const [coins, setCoins] = useState<CoinType[]>([]);
  const [portfolio, setPortfolio] = useState<number>(0.0);
  const [usdAmount, setUsdAmount] = useState<number>(0.0);
  const [usdId, setUsdId] = useState<string | undefined>();

  const updateAccounts = async () => {
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

  const update = async () => {
    await updateAccounts();
    await sleep(8000);
  };

  return {
    coins,
    portfolio,
    usdAmount,
    usdId,
    updateAccounts,
    update,
  };
};
