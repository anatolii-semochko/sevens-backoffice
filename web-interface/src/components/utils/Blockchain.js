export const serializeTransaction = (transaction) => transaction.serialize({
  requireAllSignatures: false,
  verifySignatures: false,
}).toString('base64')

export const deserializeTransaction = (transaction) => Buffer.from(transaction, 'base64')
