import { Router } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';

import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';
// import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

// interface CategoryResponse {
//   id: string;
//   title: string;
//   created_at: Date;
//   updated_at: Date;
// }
// interface TransactionsResponse {
//   id: string;
//   title: string;
//   value: number;
//   type: 'income' | 'outcome';
//   category: CategoryResponse;
//   created_at: Date;
//   updated_at: Date;
// }

// interface Transactions {
//   transactions: Array<TransactionsResponse>;
//   balance: {
//     income: number;
//     outcome: number;
//     total: number;
//   };
// }

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const categoriesRepository = getRepository(Category);
  const transactions = await transactionsRepository.find();
  const transactionsResponse = transactions.map(item => {
    return {
      id: item.id,
      title: item.title,
      value: item.value,
      type: item.type,
      category: categoriesRepository.findOne({
        where: { id: item.category_id },
      }),
      created_at: item.created_at,
      updated_at: item.updated_at,
    };
  });
  const { income, outcome, total } = await transactionsRepository.getBalance();

  const transactionsFinal = {
    transactions: transactionsResponse,
    balance: {
      income,
      outcome,
      total,
    },
  };

  return response.json(transactionsFinal);
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.body;

  const deleteTransaction = new DeleteTransactionService();

  const transaction = await deleteTransaction.execute({ id });

  return response.status(204).json(transaction);
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
