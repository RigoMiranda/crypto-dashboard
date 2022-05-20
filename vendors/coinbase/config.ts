import { CoinbasePro } from 'coinbase-pro-node';

export const getClient = () => {
  const auth = {
    apiKey: `${process.env.Key}`,
    apiSecret: `${process.env.Secret}`,
    passphrase: `${process.env.Passphrase}`,
    useSandbox: false,
    httpUrl: 'https://www.crypto.codelabs.guru',
  };
  return new CoinbasePro(auth);
};
