import React, { createContext, useState, useEffect, useContext, ReactFragment } from 'react';
import { useAccount } from '../vendors/coinbase/account';

export const AppContext = createContext<any>({});

export const AppContextProvider = ({ children }: { children: ReactFragment }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const { update, coins, portfolio, usdAmount, usdId, updateAccounts } = useAccount();
  const [refreshToken, setRefreshToken] = useState(Math.random());

  useEffect(() => {
    const startTrading = async () => {
      await update();
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
        updateAccounts,
        mode,
        setMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
