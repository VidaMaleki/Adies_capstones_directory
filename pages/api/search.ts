import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';


export default async function search(req: NextApiRequest, res: NextApiResponse) {
    try {
        const searchTerm = req.query.search as string;
        console.log('Search term:', searchTerm);
    
        const apps = await db.app.findMany({
            where: {
                OR: [
                    {appName: {contains: searchTerm, mode: 'insensitive'} },
                    { developers: { some:{ fullName: { contains: searchTerm, mode: 'insensitive' } } } },
                ],
            },
            include: {
                developers: true,
            }
        });

        if (!apps) {
            return res.status(404).json({ message: "App not found" });
        }
        console.log('Apps:', apps);
        return res.status(200).json({ apps });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}