import nodemailer from "nodemailer";
import type { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
    const { name, email, message } = req.body;

    try {
        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
            },
        });

        // Send the email
        await transporter.sendMail({
            from: email,
            to: "adiescapstonehub@gmail.com",
            subject: "Feedback from your app",
            text: `
            Name: ${name}
            Email: ${email}
            Message: ${message}
            `,
        });

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