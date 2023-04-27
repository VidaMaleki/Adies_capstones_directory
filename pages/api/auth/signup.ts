import { db } from "@/lib/db";
import { Developer } from "@prisma/client";
import validator from "validator";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { createActivationToken } from "@/utils/tokens";
import sendMail from "@/utils/sendMail";
import { activateTemplateEmail } from "@/components/emailTemplates/activate";

// npm i bcryptjs

interface DeveloperInput {
    id: number,
    fullName: string;
    email: string;
    cohort: string;
    linkedin: string;
    password: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case "POST":
            await registerDeveloper(req, res);
            break;
        case 'GET':
            const developerId = Number(req.query.id);
            if (!isNaN(developerId)) {
                return getOneDeveloper(req, res);
            }
            return getAllDevelopers(req, res);
        case "DELETE":
            await deleteDeveloper(req, res);
            break;
        case "PUT":
            await updateDeveloper(req, res);
            break;
        default:
            res.status(405).json({ message: "Method not allowed" });
    }
}

// http://localhost:3000/api/auth/signup
async function registerDeveloper(
    req: NextApiRequest, res: NextApiResponse<{message: string}>
) {
    try {
        const input: DeveloperInput = req.body;

        if (!input.fullName || !input.email || !input.cohort || !input.linkedin || !input.password) {
            return res.status(400).json({ message: "Please fill in all fields." });
        }

        if (!validator.isEmail(input.email)) {
            return res.status(400).json({ message: "Please add a valid email address." });
        }

        if (!/^\d+$/.test(input.cohort)) {
            return res.status(400).json({ message: "Cohort must contain only digits." });
        }

        if (!validator.isURL(input.linkedin)) {
            return res.status(400).json({ message: "Please enter a valid LinkedIn URL." });
        }

        const developer = await db.developer.findUnique({
            where: { email: input.email }
        });

        if (developer) {
            return res.status(400).json({ message: "This email address already exists." });
        }

        if (input.password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }

        const cryptedPassword = await bcrypt.hash(input.password, 12);

        const newdeveloper = await db.developer.create({
            data: {
                fullName: input.fullName,
                email: input.email,
                cohort: input.cohort,
                linkedin: input.linkedin,
                password: cryptedPassword
            }
        });

        const activation_token = createActivationToken({
            id: newdeveloper.id.toString()
        });

        const url = `${process.env.NEXTAUTH_URL}/activate/${activation_token}`;
        
        await sendMail(newdeveloper.email, newdeveloper.fullName, "", url, "Activate your account - Adie", activateTemplateEmail);

        res.json({ message: "Register success! Please create your app to start." });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    } 
}

// Get all developers http://localhost:3000/api/auth/signup?id=1
async function getOneDeveloper(req: NextApiRequest, res: NextApiResponse) {
    const devId = Number(req.query.id);
    try {
        const developer = await db.developer.findUnique({
        where: { id: devId },
        });
        return res.status(200).json({ developer });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Remove one user http://localhost:3000/api/auth/signup?id=1
async function getAllDevelopers(
    req: NextApiRequest,
    res: NextApiResponse<Developer[]>
) {
    if (req.method !== "GET") {
        return res.status(405).json(Array<Developer>(0));
    }

    try {
        const developers = await db.developer.findMany();
        return res.status(200).json(developers);
    } catch (error) {
        return res.status(500).json([]);
    }
}


async function deleteDeveloper(
    req: NextApiRequest,
    res: NextApiResponse<{ message: string }>
) {
    try {
        const id = req.query.id as string;

        if (!id) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const user = await db.developer.delete({
            where: { id: parseInt(id) },
        });

        res.json({ message: `User with ID ${id} has been deleted.` });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

async function updateDeveloper(
    req: NextApiRequest,
    res: NextApiResponse<{ message: string }>
) {
    try {
        const input: DeveloperInput = req.body;

        const developer = await db.developer.findUnique({
            where: { id: input.id },
        });

        if (!developer) {
            return res.status(404).json({ message: "Developer not found" });
        }

        if (input.email !== developer.email) {
            const existingDeveloper = await db.developer.findUnique({
                where: { email: input.email },
            });
            if (existingDeveloper) {
                return res
                    .status(400)
                    .json({ message: "This email address already exists." });
            }
        }

        const updatedDeveloper = await db.developer.update({
            where: { id: input.id },
            data: {
                fullName: input.fullName,
                email: input.email,
                cohort: input.cohort,
                linkedin: input.linkedin,
                password: input.password
                    ? await bcrypt.hash(input.password, 6)
                    : undefined,
            },
        });

        res.json({ message: "Developer updated successfully" });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}