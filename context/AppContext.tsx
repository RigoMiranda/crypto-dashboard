import React, { createContext, useState, useEffect, useContext, ReactFragment } from 'react';
import { Trader } from '../vendors/coinbase/trader';

export const AppContext = createContext<any>({});

export const AppContextProvider = ({ children }: { children: ReactFragment }) => {
  const [isSandBox, setIsSandBox] = useState(true);
  const [isTrading, setIsTrading] = useState(true);
  const [openCredentialModal, setOpenCredentialModal] = useState(false);
  const [openNewCoinModal, setOpenNewCoinModal] = useState(false);
  const [trader, setTrader] = useState<Trader>();
  const [refreshToken, setRefreshToken] = useState(Math.random());

  const getTrader = async () => {
    const newTrader = new Trader();
    newTrader.setTrader = setTrader;
    await newTrader?.init();
  };

  // When new API credentials are added.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!trader) getTrader();
  }, []);

  // Run Trading Bot
  useEffect(() => {
    const startTrading = async () => {
      await trader?.updateTrader();
      // await trader?.trade();
      setRefreshToken(Math.random());
    };
    if (isTrading) startTrading();
  }, [isTrading, refreshToken]);

  return (
    <AppContext.Provider
      value={{
        isSandBox,
        setIsSandBox,
        openCredentialModal,
        setOpenCredentialModal,
        trader,
        setTrader,
        isTrading,
        setIsTrading,
        openNewCoinModal,
        setOpenNewCoinModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
