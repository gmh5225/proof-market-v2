export const dbUrl = process.env.DB_URL || 'postgresql://proof_market:proof_market_pass@localhost:15433/proof_market'

export const logLevel = process.env.LOG_LEVEL || 'info'
export const swaggerLocalPath = process.env.SWAGGER_LOCAL_PATH || './tsoa-output/swagger.json'
export const saltRounds = parseInt(process.env.SALT_ROUNDS || '10')
export const jwtSecret = process.env.JWT_SECRET || 'jwtSecret'
export const minTokensForProducer = parseInt(process.env.MIN_TOKENS_FOR_PRODUCER || '500')
export const jaegerHost = process.env.JAEGER_HOST || 'http://localhost:14268/api/traces'
export const useProposals = (process.env.USE_PROPOSALS || 'false') == 'true'
export const blockchainNode = process.env.BLOCKCHAIN_NODE || 'https://ethereum-sepolia-rpc.publicnode.com'
export const blockchainChainId = parseInt(process.env.BLOCKCHAIN_CHAIN_ID || '11155111')
export const blockchainPrivateKey = process.env.BLOCKCHAIN_PRIVATE_KEY || '0xb4f1d55cb2c640305904c085ddf919865510d7da5d1023a919e2330d3db4b055'
export const blockchainContractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS || '0xd6c12d88BCcD93AC2d326b3d1CCf5b90063884D0'
export const useDatadog = process.env.USE_DATADOG || true
export const useOpenTelemetry = process.env.USE_OPENTELEMETRY || false
export const assignerPath = process.env.ASSIGNER_PATH || './path/to/assigner'
export const proofGeneratorPath = process.env.PROOF_GENERATOR_PATH || './path/to/generator'