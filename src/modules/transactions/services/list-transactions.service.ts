import { toTransactionResponse } from '@/modules/transactions/mappers/transaction.mapper.js';
import { findAllTransactionsRepository } from '@/modules/transactions/repositories/find-all-transactions.repository.js';

export async function listTransactionsService() {
  const transactions = await findAllTransactionsRepository();
  return transactions.map(toTransactionResponse);
}
