import { getRepository, getCustomRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import parse from 'csv-parse';
import 'csv-parse/lib/es5';

import uploadConfig from '../config/upload';
// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
// import CreateTransactionService from './CreateTransactionService';

interface Request {
  csvFilename: string;
}
class ImportTransactionsService {
  async execute({ csvFilename }: Request): Promise<Transaction[]> {
    const transactionRepository = getRepository(Transaction);
    const transactionFilePath = path.join(uploadConfig.directory, csvFilename);
    const transacionsData = fs.readFileSync(transactionFilePath);
    const output: Array<string> = [];
    const parser = parse({ delimiter: ',' });

    parser.on('readable', function () {
      let record;
      // eslint-disable-next-line no-cond-assign
      // prettier-ignore
      while (record = parser.read()) {
        output.push(record);
        console.log(record);
      }
    });
    // Catch any error
    parser.on('error', function (err) {
      console.error(err.message);
    });

    // parser.on('end', function () {
    //   console.log(output);
    // });

    console.log(output);

    parser.write(transacionsData);

    parser.end();
    // prettier-enable
    // const transactions = transacionsData.pipe(parser);

    // const parser = parse({ delimiter: ',' }, function (err, data) {
    //   return data;
    // data.map((item: Transaction, index: number) => {

    //   if (index !== 0) {
    //     // const { title, type, value, category } = item;
    //     // const transaction = await transactionRepository.create({
    //     //   title,
    //     //   type,
    //     //   value,
    //     //   category,
    //     // });
    //     // transactionRepository.save(transaction);
    //     // output.push(item);
    //   }
    // });
    // });
    // const transactions = transacionsData.pipe(parser);

    // console.log(transactions);
  }
}

export default ImportTransactionsService;
