import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import parse from 'csv-parse';

import uploadConfig from '../config/upload';
// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  csvFilename: string;
}

class ImportTransactionsService {
  async execute({ csvFilename }: Request): Promise<Transaction[]> {
    const transactionsRepository = getRepository(Transaction);
    // const transactions = await transactionsRepository(Transaction);
    const createTransaction = new CreateTransactionService();

    const csvFilePath = path.join(uploadConfig.directory, csvFilename);
    const loadedCsvDatas = fs.createReadStream(csvFilePath);
    const parser = parse({ delimiter: ',' });
    const output: Transaction[] = [];
    parser.on('data', async data => {
      const [title, type, value, category] = data;
      const transaction = await createTransaction.execute({
        title,
        value,
        type,
        category,
      });
      output.push(transaction);
    });
    loadedCsvDatas.pipe(parser);
    output.shift();

    output.map(async item => {
      const findTransactions = await transactionsRepository.findOne({
        title: item.title,
      });
      if (!findTransactions) {
        await transactionsRepository.save(item);
      }
    });

    return output;
  }
}

export default ImportTransactionsService;
