
export const dbUrl = process.env.DB_ULR || 'postgresql://proof_market:proof_market_pass@localhost:15433/proof_market';
export const saltRounds = process.env.SALT_ROUNDS || 10;
export const jwtSecret = process.env.JWT_SECRET || 'jwtSecret';
