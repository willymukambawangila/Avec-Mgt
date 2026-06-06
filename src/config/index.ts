/**
 * Environment configuration
 */

const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  },

  // Authentication
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    tokenExpiry: parseInt(process.env.NEXT_PUBLIC_TOKEN_EXPIRY || '3600'),
  },

  // Blockchain/Web3
  blockchain: {
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo',
    chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '1'),
    nativeToken: process.env.NEXT_PUBLIC_NATIVE_TOKEN || 'ETH',
    stablecoins: {
      USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS || '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      USDT: process.env.NEXT_PUBLIC_USDT_ADDRESS || '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      DAI: process.env.NEXT_PUBLIC_DAI_ADDRESS || '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    },
  },

  // Crypto Currencies
  crypto: {
    supportedChains: ['ethereum', 'polygon', 'arbitrum'],
    supportedCoins: ['ETH', 'BTC', 'USDC', 'USDT', 'DAI'],
  },

  // Features
  features: {
    enableKyc: process.env.NEXT_PUBLIC_ENABLE_KYC === 'true',
    enableCryptoPayments: process.env.NEXT_PUBLIC_ENABLE_CRYPTO_PAYMENTS === 'true',
    enableInvestments: process.env.NEXT_PUBLIC_ENABLE_INVESTMENTS === 'true',
    enableNotifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },

  // Security
  security: {
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    encryptionKey: process.env.ENCRYPTION_KEY,
  },

  // Database
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/avec-mgt',
    poolSize: parseInt(process.env.DB_POOL_SIZE || '10'),
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    ttl: parseInt(process.env.REDIS_TTL || '3600'),
  },

  // Email
  email: {
    provider: process.env.EMAIL_PROVIDER || 'sendgrid',
    from: process.env.EMAIL_FROM || 'noreply@avec-mgt.com',
    apiKey: process.env.EMAIL_API_KEY,
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },

  // Environment
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

export default config;
