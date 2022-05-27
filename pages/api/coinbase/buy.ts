import { NextApiRequest, NextApiResponse } from 'next';
import coin from '../../../vendors/coinbase/coin';
import { getClient } from '../../../vendors/coinbase/config';

const client = getClient();

const Buy = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    res.status(200).json({ message: 'Buy' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: `Unexpected Error: ${error}` });
  }
};

export default Buy;
