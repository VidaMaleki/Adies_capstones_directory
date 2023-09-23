import { db } from "@/lib/db";
import { Developer } from "@prisma/client";
import validator from "validator";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { createActivationToken } from "@/utils/tokens";
import sendMail from "@/utils/sendMail";
import { activateTemplateEmail } from "@/components/SignIn/components/emailTemplates/activate";
import dotenv from "dotenv";
// npm i bcryptjs

dotenv.config({ path: ".env.emails" });

interface DeveloperInput {
  id: number;
  fullName: string;
  email: string;
  cohort: string;
  linkedin: string;
  image: string;
  password: string;
}

interface AuthorizedEmail {
  email: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      await registerDeveloper(req, res);
      break;
    case "GET":
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


async function registerDeveloper(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  try {
    const input: DeveloperInput = req.body;

    if (!input.fullName || !input.email || !input.password) {
      return res
        .status(400)
        .json({ message: "Please fill in all necessary fields." });
    }

    if (!validator.isEmail(input.email)) {
      return res
        .status(400)
        .json({ message: "Please add a valid email address." });
    }

    if (!/^\d+$/.test(input.cohort)) {
      return res
        .status(400)
        .json({ message: "Cohort must contain only digits." });
    }

    if (!validator.isURL(input.linkedin)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid LinkedIn URL." });
    }

    const developer = await db.developer.findUnique({
      where: { email: input.email },
    });

    if (developer) {
      return res
        .status(400)
        .json({ message: "This email address already exists." });
    }

    if (input.password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }
    console.log("authorizedEmails", 
      process.env.AUTHORIZED_EMAILS || "[]")
    // Check if the user's email is in the list of authorized emails
    const authorizedEmails: AuthorizedEmail[] = JSON.parse(
      process.env.AUTHORIZED_EMAILS || "[]"
    );
    console.log("authorizedEmails2",authorizedEmails)
    const isAuthorizedEmail = authorizedEmails.some(
      (authorizedEmail) => authorizedEmail.email === input.email
    );

    if (!isAuthorizedEmail) {
      return res
        .status(403)
        .json({ message: "Your email is not authorized to create account." });
    }

    const cryptedPassword = await bcrypt.hash(input.password, 12);
    console.log(cryptedPassword)
    const newdeveloper = await db.developer.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        cohort: input.cohort,
        linkedin: input.linkedin,
        image: input.image,
        password: cryptedPassword,
      },
    });
    console.log(newdeveloper)
    console.log(createActivationToken({
      id: newdeveloper.id.toString(),
    }))
    const activation_token = createActivationToken({
      id: newdeveloper.id.toString(),
    });
    console.log("activation_token", activation_token)
    const url = `${process.env.NEXTAUTH_URL}/activate/${activation_token}`;

    await sendMail(
      newdeveloper.email,
      newdeveloper.fullName,
      "",
      url,
      "Please activate your account",
      activateTemplateEmail,
      "",
      ""
    );

    res.json({
      message: "Register success! Please create your app to get start.",
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

// Get all developers 
async function getOneDeveloper(req: NextApiRequest, res: NextApiResponse) {
  const devId = Number(req.query.id);
  try {
    const developer = await db.developer.findUnique({
      where: { id: devId },
      include: {
        app: true, // Include the associated app
      },
    });
    return res.status(200).json({ developer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Remove one user 
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

// Delete the developer
async function deleteDeveloper(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  try {
    const id = req.query.id as string;

    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const developer = await db.developer.findUnique({
      where: { id: parseInt(id) },
    });

    if (!developer) {
      return res.status(404).json({ message: "Developer not found." });
    }

    // Check if the developer is associated with any apps
    const apps = await db.app.findMany({
      where: {
        developers: {
          some: {
            id: developer.id,
          },
        },
      },
    });

    for (const app of apps) {
      const developerCount = await db.developer.count({
        where: {
          app: {
            id: app.id,
          },
        },
      });

      if (developerCount === 1) {
        // If there is only one developer associated with the app, delete the app
        await db.app.delete({
          where: {
            id: app.id,
          },
        });
      }
    }

    // Delete the developer
    await db.developer.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: `User with ID ${id} has been deleted.` });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

// Update developer info
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

    const updatedData: any = {
      fullName: input.fullName,
      email: input.email,
      cohort: input.cohort,
      linkedin: input.linkedin,
      password: input.password
        ? await bcrypt.hash(input.password, 12)
        : undefined,
    };

    if (input.image) {
      updatedData.image = input.image;
    }

    const updatedDeveloper = await db.developer.update({
      where: { id: input.id },
      data: updatedData,
    });

    res.json({ message: "Developer updated successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}