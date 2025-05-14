import { PrismaClient } from '../generated/prisma';

// Use a global variable to prevent multiple instances in development
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Prevent multiple instances of Prisma Client in development
export const prisma = 
  globalForPrisma.prisma || 
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma; 