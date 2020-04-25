import path from 'path';
import fs from 'fs';
import parse from 'csv-parse';

import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';

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
  public async execute({ csvFilename }: Request): Promise<Transaction[]> {
    // const transactionRepository = getRepository(Transaction);
    const transactionFilePath = path.join(uploadConfig.directory, csvFilename);
    const transacionsData = await fs.promises.readFile(transactionFilePath);
    const output: Transaction[] = [];
    const parser = parse({ delimiter: ',' });

    parser.on('readable', () => {
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

    parser.write(transacionsData);

    parser.end();
    output.shift();

    console.log('OUT', output);
    return output;
  }
}

export default ImportTransactionsService;
