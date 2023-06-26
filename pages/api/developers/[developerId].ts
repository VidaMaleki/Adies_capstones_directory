import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    await db.$connect();
    const id = parseInt(req.query.id as string);
    const developers = await db.developer.findUnique({ where: { id: id }});
    res.json(developers);
}