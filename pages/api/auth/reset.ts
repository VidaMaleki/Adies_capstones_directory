import { db } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";

const { RESET_TOKEN_SECRET } = process.env;
interface UserToken {
    id:string;
}
// Middleware function to connect to the database
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await db.$connect();
        const { token, password} = req.body;
        const userToken = jwt.verify(token, RESET_TOKEN_SECRET!) as UserToken;
        const developerId = parseInt(userToken?.id as string, 10);
        const developerDb = await db.developer.findUnique({ where: { id: developerId } });
        if (!developerDb) {
            return res
            .status(400)
            .json({message: "This account no longer exist."})
        }
        const cryptedPassword = await bcrypt.hash(password, 12)
        await db.developer.update({where:{ id: developerId },data: { password: cryptedPassword } }); 
        res.json({
            message:"Your account password has been successfuly updated!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
    } 
};



