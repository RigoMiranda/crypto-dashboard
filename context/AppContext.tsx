import React, { createContext, useState, useEffect, useContext, ReactFragment } from 'react';
import { useTrader } from '../vendors/coinbase/trader';

export const AppContext = createContext<any>({});

export const AppContextProvider = ({ children }: { children: ReactFragment }) => {
  const { trade, coins, portfolio, usdAmount, usdId, updateTrader } = useTrader();
  const [refreshToken, setRefreshToken] = useState(Math.random());

  useEffect(() => {
    const startTrading = async () => {
      await trade();
      setRefreshToken(Math.random());
    };
    startTrading();
  }, [refreshToken]);

  return (
    <AppContext.Provider
      value={{
        coins,
        portfolio,
        usdAmount,
        usdId,
        updateTrader,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
