import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const findIncome = await this.find({
      where: { type: 'income' },
    });
    const findOutcome = await this.find({
      where: { type: 'outcome' },
    });
    const reducer = (accumulator: number, valCurrent: number): number =>
      accumulator + valCurrent;
    const income = findIncome.map(item => item.value).reduce(reducer, 0);
    const outcome = findOutcome.map(item => item.value).reduce(reducer, 0);
    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
