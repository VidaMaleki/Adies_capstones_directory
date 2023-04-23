import { db } from "@/lib/db";
import { Developer } from "@prisma/client";
import validator from "validator";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
// npm i bcryptjs

interface DeveloperInput {
    fullName: string;
    email: string;
    cohort: number;
    linkedin: string;
    password: string;
}
export default async function handeler(
    req: NextApiRequest, res: NextApiResponse
) {
    try{
        const input: DeveloperInput = req.body;
    if (!input.fullName || !input.email || !input.cohort || !input.linkedin || !input.password){
        return res.status(400).json({message:"Please fill in all fields."});
    }
    if (!validator.isEmail(input.email)) {
        return res
            .status(400)
            .json({message: "Please Add a valid email address."})
    }
    if (!validator.isNumeric(input.cohort.toString())) {
        return res
            .status(400)
            .json({message: "Please Add number for cohort."})
    }
    if (!validator.isURL(input.linkedin)) {
        return res.status(400)
        .json({message:"Please enter valid Linkedin URL."})
    }
    const developer = await db.developer.findUnique({
        where :  {email: input.email}
    });
    if (developer) {
        return res
        .status(400)
        .json({message: "This email address already exists."})
    }
    if (input.password.length < 6 ) {
        return res
        .status(400)
        .json({message:"Password must be atleast 6 characters."})
    }
    const cryptedPassword = await bcrypt.hash(input.password, 12);
    const newdeveloper = await db.developer.create({
        data:{
            fullName: input.fullName,
            email: input.email,
            cohort: input.cohort,
            linkedin: input.linkedin,
            password: cryptedPassword
        }
    })
    res.json({message: "Register Success! Please create your app to start."})
    }
    catch (error) {
        res.status(500).json({message: (error as Error).message})
    }
}



