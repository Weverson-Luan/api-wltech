/**
 * IMPORTS
 */


const BRAZILIAN_PHONE_DIGITS = /^(?:55)?(\d{2})(\d{8,9})$/;

/**
 * Funcao para normalizar o telefone brasileiro
 * @param phone - O telefone brasileiro a ser normalizado
 * @returns O telefone brasileiro normalizado
 */
export function normalizeBrazilianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const match = digits.match(BRAZILIAN_PHONE_DIGITS);

  if (!match) {
    return digits;
  }

  const [, ddd, number] = match;
  return `${ddd}${number}`;
}

/**
 * Funcao para validar o telefone brasileiro
 * @param phone - O telefone brasileiro a ser validado
 * @returns true se o telefone brasileiro for valido, false caso contrario
 */
export function isValidBrazilianPhone(phone: string): boolean {
  const normalized = normalizeBrazilianPhone(phone);

  const match = normalized.match(/^(\d{2})(\d{8,9})$/);

  if (!match) {
    return false;
  }

  const [, ddd, number] = match;
  const dddNumber = Number(ddd);

  if (dddNumber < 11 || dddNumber > 99) {
    return false;
  }

  if (number.length === 9 && number[0] !== '9') {
    return false;
  }

  if (number.length === 8 && number[0] === '9') {
    return false;
  }

  return number.length === 8 || number.length === 9;
}
/**
 * Funcao para formatar o telefone brasileiro
 * @param phone - O telefone brasileiro a ser formatado
 * @returns O telefone brasileiro formatado
 */
export function formatBrazilianPhone(phone: string): string {
  const formatted_phone = normalizeBrazilianPhone(phone);

  if (formatted_phone.length === 11) {
    return `(${formatted_phone.slice(0, 2)}) ${formatted_phone.slice(2, 7)}-${formatted_phone.slice(7)}`;
  }

  if (formatted_phone.length === 10) {
    return `(${formatted_phone.slice(0, 2)}) ${formatted_phone.slice(2, 6)}-${formatted_phone.slice(6)}`;
  }

  return phone;
}
