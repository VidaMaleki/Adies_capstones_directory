import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';


export async function searchApps(req: NextApiRequest, res: NextApiResponse) {
    try {
        const searchTerm = req.query.search as string;
    
        const apps = await db.app.findMany({
            where: {
            appName: {
                contains: searchTerm,
                mode: 'insensitive',
            },
            },
        });
    
        return res.status(200).json({ apps });
    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
    }
}