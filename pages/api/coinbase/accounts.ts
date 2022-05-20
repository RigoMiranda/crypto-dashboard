import { NextApiRequest, NextApiResponse } from 'next';
import { getClient } from '../../../vendors/coinbase/config';

const client = getClient();

const Coin = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const accounts = await client?.rest.account.listAccounts();

    let tempAccounts = [];
    let usdId = '';
    let usdAmount = 0.0;

    for (const account of accounts) {
      if (account.available !== '0') {
        if (account.currency === 'USD') {
          usdId = account.id;
          usdAmount = Number(account.available);
        } else {
          tempAccounts.push(account);
        }
      }
    }

    res.status(200).json({ accounts: tempAccounts, usdId, usdAmount });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: `Unexpected Error: ${error}` });
  }
};

export default Coin;
