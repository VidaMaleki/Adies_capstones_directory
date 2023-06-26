import {db} from './db';

async function testConnection() {
  try {
    const prisma = await db.$connect();
    console.log('Connection successful');
    // You can perform some basic database operations here to further test the connection
    // For example: const users = await prisma.user.findMany();
    await db.$disconnect();
  } catch (error) {
    console.error('Connection error:', error);
  }
}

testConnection();