export const dbUrl = process.env.DB_ULR || 'postgresql://proof_market:proof_market_pass@localhost:15433/proof_market'
export const saltRounds = parseInt(process.env.SALT_ROUNDS || '10')
export const jwtSecret = process.env.JWT_SECRET || 'jwtSecret'
export const minTokensForProducer = parseInt(process.env.MIN_TOKENS_FOR_PRODUCER || '500')
export const jaegerHost = process.env.JAEGER_HOST || 'http://localhost:14268/api/traces'