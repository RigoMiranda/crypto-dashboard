import { NextApiRequest, NextApiResponse } from 'next';
import coin from '../../../vendors/coinbase/coin';
import { getClient } from '../../../vendors/coinbase/config';

const client = getClient();

const Coin = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const accounts = await client?.rest.account.listAccounts();
    let coins = [];
    let usdId = '';
    let usdAmount = 0.0;
    let portfolio = 0.0;

    for (const account of accounts) {
      if (account.available !== '0') {
        if (account.currency === 'USD') {
          usdId = account.id;
          usdAmount = Number(account.available);
          portfolio += usdAmount;
        } else {
          /* Get Only USD Coins */
          const tempCoin = await coin(account.id, `${account.currency}-USD`);
          portfolio += tempCoin?.usd || 0;
          coins.push({
            ...tempCoin,
            currency: account.currency,
            logo: `/crycons/${account.currency.toLocaleLowerCase()}.png`,
          });
        }
      }
    }

    if (coin.length >= 1) {
      coins = coins.sort((a, b) => (b.usd || 0) - (a.usd || 0));
    }
    res.status(200).json({ coins, usdId, usdAmount, portfolio });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: `Unexpected Error: ${error}` });
  }
};

export default Coin;
