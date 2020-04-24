import { Router } from 'express';
import multer from 'multer';
import { getRepository, getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';

import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

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
  const { title, value, type, category } = request.body;
  const createTransaction = new CreateTransactionService();
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.status(200).json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  const transaction = await deleteTransaction.execute({ id });

  return response.status(204).json(transaction);
});

transactionsRouter.post(
  '/import',
  upload.single('csvFile'),
  async (request, response) => {
    const importTrasactions = new ImportTransactionsService();
    const fileImported = await importTrasactions.execute({
      csvFilename: request.file.filename,
    });
    return response.status(200).json(fileImported);
  },
);

export default transactionsRouter;
