import Transaction from '../models/Transaction';

class ImportTransactionsService {
  public async execute({ csvFilename }: Request): Promise<Transaction[]> {
    // const transactionRepository = getRepository(Transaction);
    const transactionFilePath = path.join(uploadConfig.directory, csvFilename);

    let transacionsData;
    try {
      transacionsData = await fs.promises.readFile(transactionFilePath);
    } catch (err) {
      console.error(err);
    } finally {
      if (transacionsData !== undefined) await transacionsData.close();
    }
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
      throw err;
    });

    parser.write(transacionsData);

    parser.end();
    output.shift();

    console.log('OUT', output);
    // await fs.promises.unlink(transactionFilePath);
    return output;
  }
}

export default ImportTransactionsService;
