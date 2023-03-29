import { PrismaClient } from '@prisma/client';
// Because Next API functions run in a serveless environment, 
// we're going to cache our Prisma client and reuse it when possible to avoid having too many connections.
// this is pretty copy and paste, but there's only one way to do it
// npx prisma studio 

declare global {
    // eslint-disable-next-line no-var
    var cachedPrisma: PrismaClient;
    }
    
    let prisma: PrismaClient;
    if (process.env.NODE_ENV === "production") {
        prisma = new PrismaClient();
    } else {
        if (!global.cachedPrisma) {
            global.cachedPrisma = new PrismaClient();
        }
    prisma = global.cachedPrisma;
}

export const db = prisma;