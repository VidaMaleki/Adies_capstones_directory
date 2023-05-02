import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { db } from '@/lib/db';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    await db.$connect();
    const { id } = req.query;
    const developer = await db.developer.findUnique({ where: { id: id }});
    res.json(developer);
}