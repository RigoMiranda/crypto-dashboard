export interface BotOrder {
  id: string;
  currency: string;
  executed_value: number;
  price: number;
  size: number;
  type: 'buy' | 'sell';
  created_at: string;
}

export const MockedOrders: BotOrder[] = [
  {
    id: '',
    currency: '',
    executed_value: 50.2,
    price: 50,
    size: 1,
    type: 'buy',
    created_at: '',
  },
  {
    id: '',
    currency: '',
    executed_value: 48.16,
    price: 48,
    size: 1,
    type: 'buy',
    created_at: '',
  },
  {
    id: '',
    currency: '',
    executed_value: 46.06,
    price: 46,
    size: 1,
    type: 'buy',
    created_at: '',
  },
];
