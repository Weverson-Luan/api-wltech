import type { TransactionResponseDto } from '@/modules/transactions/dtos/transaction-response.dto.js';
import type { TransactionRecord } from '@/modules/transactions/types/transaction.types.js';

export function toTransactionResponse(transaction: TransactionRecord): TransactionResponseDto {
  return {
    id: transaction.id,
    user_id: transaction.user_id,
    type: transaction.type,
    amount: transaction.amount,
    category_id: transaction.category_id,
    category_name: transaction.category_name,
    payment_method: transaction.payment_method,
    date: transaction.date,
    created_at: transaction.created_at,
    updated_at: transaction.updated_at,
  };
}
