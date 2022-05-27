import axios from 'axios';
import { CoinType } from '../../../types';
import { calculatePercentageIncrease } from '../../utils';

export class Bot {
  budget: number;
  coin: CoinType;
  downPercentage: number;
  isTrading: boolean;
  percentagePerBuyOrder: number;
  upPercentage: number;

  constructor(
    _budget: number,
    _coin: CoinType,
    _downPercentage: number = -3,
    _isTrading: boolean = false,
    _percentagePerBuyOrder: number = 0.32,
    _upPercentage: number = 3
  ) {
    this.budget = _budget;
    this.coin = _coin;
    this.downPercentage = _downPercentage;
    this.isTrading = _isTrading;
    this.percentagePerBuyOrder = _percentagePerBuyOrder;
    this.upPercentage = _upPercentage;
  }

  load = () => {};

  private budgetLeft = () => {
    if (this.coin.activeBuyingOrders.length === 0) return this.budget;
    return this.budget * (this.coin.activeBuyingOrders.length * this.percentagePerBuyOrder);
  };

  private buy = async () => {
    try {
      const budgetLeft = this.budgetLeft();
      if (budgetLeft - this.coin.price < 5) return;

      if (this.coin.activeBuyingOrders.length === 0) {
        /* Wait to fall or just buy current price? */
        if (this.coin.percentage24h < 0) {
          console.log(
            `Buy ${this.coin.currency}, it is down ${this.coin.percentage24h}% in the last 24 hours`
          );
        }
      } else {
        const lastOrder = this.coin.activeBuyingOrders[this.coin.activeBuyingOrders.length - 1];
        const { percentage } = calculatePercentageIncrease(
          this.coin.price,
          Number(lastOrder.price)
        );
        if (percentage < this.downPercentage) {
          console.log(
            `Buy ${this.coin.currency}, it is down ${this.coin.percentage24h}% since last order!`
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  private sell = async () => {
    if (!this.coin.doneBuyingOrders || this.coin.doneBuyingOrders.length === 0) return;
    for (const order of this.coin.doneBuyingOrders) {
      const { percentage } = calculatePercentageIncrease(this.coin.price, Number(order.price));
      if (percentage >= this.upPercentage) {
        console.log(Number(order.executed_value) * Number(`1.${this.upPercentage}`));
        console.log(`Sell ${this.coin.currency}, this order is up ${percentage}% !`);
      }
    }
  };

  /* */
  private analyze = async () => {
    if (this.coin?.difCalc?.percentage) {
      /* Buy */
      await this.buy();

      /* Sell*/
      await this.sell();
    }
  };

  /* Main Function */
  trade = async () => {
    // if (!this.isTrading) return;

    await this.analyze();
  };
}
