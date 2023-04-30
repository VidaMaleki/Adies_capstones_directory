import { db } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";

const { ACTIVATION_TOKEN_SECRET } = process.env;
interface UserToken {
    id:string;
}
// Middleware function to connect to the database
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await db.$connect();
        const { token } = req.body;
        const userToken = jwt.verify(token, ACTIVATION_TOKEN_SECRET!) as UserToken;
        const developerId = parseInt(userToken?.id as string, 10);
        const developerDb = await db.developer.findUnique({ where: { id: developerId } });
        console.log(developerDb)
        console.log(userToken.id)
        // return;
        if (developerDb?.emailVerified == true) {
            return res
            .status(400)
            .json({message: "Your email address already verified."});
        }
        await db.developer.update({where:{ id: developerId },data: { emailVerified: true } }); 
        res.json({
            message:"Your account successfuly verified!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
    } 
    // finally {
    //     await db.$disconnect();
    // }
};


// { id: '18', iat: 1682456520, exp: 1682629320 }
// {token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3IiwiaWF0IjoxNjgyNDU2NTIwLCJleHAiOjE2ODI2MjkzMjB9.syZ5Gsx-qFxUPpDju-3tuVj3amGZLAK4UZN9qentRnc'}

