// import { getRepository, getCustomRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import parse from 'csv-parse';
// import 'csv-parse/lib/es5';

import uploadConfig from '../config/upload';
// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
// import TransactionsRepository from '../repositories/TransactionsRepository';
// import CreateTransactionService from './CreateTransactionService';

interface Request {
  csvFilename: string;
}
interface TransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class ImportTransactionsService {
  async execute({ csvFilename }: Request): Promise<Transaction[]> {
    // const transactionRepository = getRepository(Transaction);
    const transactionFilePath = path.join(uploadConfig.directory, csvFilename);
    const transacionsData = fs.readFileSync(transactionFilePath);
    const output: Transaction[] = [];
    const parser = parse({ delimiter: ',' });

    parser.on('readable', function () {
      let record;
      // eslint-disable-next-line no-cond-assign
      // prettier-ignore
      while (record = parser.read()) {
        const [title, type, value, category ] = record;
        output.push({title, type, value, category,...record});
      }
    });
    // prettier-enable

    // Catch any error
    parser.on('error', err => {
      console.error(err.message);
    });

    // parser.on('end', function () {
    //   console.log(output);
    // });
    parser.write(transacionsData);

    parser.end();
    output.shift();

    console.log('OUT', output);
    return output;
  }
}

export default ImportTransactionsService;
