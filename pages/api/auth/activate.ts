import { db } from "@/lib/db";
import { Developer } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";

const { ACTIVATION_TOKEN_SECRET } = process.env;

// Middleware function to connect to the database
export const connectDb = (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await db.$connect();
        return handler(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
    } finally {
        await db.$disconnect();
    }
};

export default connectDb(async function activateHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { token } = req.body;
        const userToken = jwt.verify(token, ACTIVATION_TOKEN_SECRET!) as JwtPayload;

        const developerDb = await db.developer.findUnique({ where: { id: userToken?.id } });
        
        if (!developerDb) {
        return res.status(400).json({ message: "Invalid activation token." });
        }
        if (developerDb.emailVerified) {
        return res.status(400).json({ message: "Email address already verified." });
        }

        await db.developer.update({ where: { id: developerDb.id }, data: { emailVerified: true } });

        res.json({
        message: "Your account has been successfully verified.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
    }
});
// const developerDb = await db.developer.findUnique({ where: { id: userToken.id } })
// { id: '17', iat: 1682456520, exp: 1682629320 }
// {
//   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3IiwiaWF0IjoxNjgyNDU2NTIwLCJleHAiOjE2ODI2MjkzMjB9.syZ5Gsx-qFxUPpDju-3tuVj3amGZLAK4UZN9qentRnc'
// }

