import { PrismaClient } from '@prisma/client';

declare global {
    var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

async function connect() {
    if (typeof window === "undefined") {
        if (process.env.NODE_ENV === 'production') {
            prisma = new PrismaClient();
        } else {
            if (!global.cachedPrisma) {
            global.cachedPrisma = new PrismaClient();
            }
            prisma = global.cachedPrisma;
        }

        await prisma.$connect();

        return prisma;
    }
}

const db = await connect();

export { db };