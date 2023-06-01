import { db } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { createResetToken } from "@/utils/tokens";
import sendMail from "@/utils/sendMail";
import { resetPasswordEmail } from "@/components/emailTemplates/reset";

// Middleware function to connect to the database
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await db.$connect();
        const { email } = req.body;
        const developer = await db.developer.findUnique({where: {email: email}}) 
        if (!developer) {
            return res.status(400).json({message: "This email does not exist."})
        }
        const developer_id = createResetToken({
            id: developer.id.toString(),
        });
        const url = `${process.env.NEXTAUTH_URL}/reset/${developer_id}`;
        await sendMail(
            email,
            developer.fullName, 
            "",
            url, 
            "Reset your password - Adie ",
            resetPasswordEmail
        )
        res.json({
            message:"An email has been sent to you, use it to reset your password."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: (error as Error).message });
    } 
};
