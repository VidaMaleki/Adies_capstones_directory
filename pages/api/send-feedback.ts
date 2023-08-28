import type { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
import sendMail from "@/utils/sendMail";
import { feedbackTemplateEmail } from "@/components/SignIn/components/emailTemplates/Feedback";

dotenv.config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
    const { name, email, message } = req.body;


    try {
        await sendMail(
            "adiescapstonehub@gmail.com",
            name,
            //image
            "",
            //email_link
            "", 
            `You have received feedback from ${email}`,
            feedbackTemplateEmail,
            message,
            email,
        );
        // Email sent successfully
        res.status(200).json({ message: "Email sent" });
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending email" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}