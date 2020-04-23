import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const checkCategoryExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (type === 'outcome') {
      const { total } = await transactionsRepository.getBalance();
      if (value > total) throw new AppError('Outcome greater than balance!');
    }

    let categoryId;

    if (checkCategoryExists) {
      categoryId = checkCategoryExists.id;
    } else {
      const categoryCreate = categoriesRepository.create({
        title: category,
      });
      const categoryNew = await categoriesRepository.save(categoryCreate);
      categoryId = categoryNew.id;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryId,
    });

    return transaction;
  }
}

export default CreateTransactionService;
