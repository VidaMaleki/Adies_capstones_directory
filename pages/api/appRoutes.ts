// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import validator from "validator";



interface AppInput {
  appName: string;
  description: string;
  ownerId: number;
  developers: string[];
  appLink?: string;
  videoLink?: string;
  github?: string;
  type: string;
  technologies: string[];
}

interface DeveloperInput {
  fullName: string;
  email: string;
}

export default async function createAppHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case 'POST':
      return createApp(req, res);
    case 'GET':
      const appId = Number(req.query.id);
      if (!isNaN(appId)) {
        return getOneApp(req, res);
      }
      return getAllApps(req, res);
    case 'PUT':
      return updateApp(req, res);
    case 'DELETE':
      return deleteApp(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// http://localhost:3000/api/appRoutes and write details of app
async function createApp(req: NextApiRequest, res: NextApiResponse) {
  // const typeLisoot: string[]= ["web app", "mobile app", "social media", "game"]
  // Validate the input data here
  try {
    const input: AppInput = req.body;
    // const developerInput : DeveloperInput = req.body;

    if (!input.appName || !input.developers || !input.type || !input.technologies || !input.github) {
      // console.log(`${input.appName}, ${input.developers}, ${input.type}, ${input.technologies}, ${input.github}`)
      return res.status(400).json({ message: `Please fill in all fields: ${input.appName}, ${input.developers}, ${input.type}, ${input.technologies}, ${input.github}` });
    }

    if (!validator.isURL(input.appLink! || input.videoLink! || input.github)) {
      return res.status(400).json({ message: "Please enter a valid URL." });
    }

    if (input.technologies.length > 5) {
      return res.status(400).json({ message: "Please add maximum of 5 technologies." });
    }
    
    const app = await db.app.create({
      data: {
        appName: input.appName,
        description: input.description,
        ownerId: input.ownerId,
        developers: input.developers,
        appLink: input.appLink,
        videoLink: input.videoLink,
        github: input.github,
        type: input.type,
        technologies: input.technologies,
      },
    });
    return res.status(201).json({ app });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `${error}` });
  }
}

// http://localhost:3000/api/appRoutes?id=1
async function getOneApp(req: NextApiRequest, res: NextApiResponse) {
  const appId = Number(req.query.id);
  try {
    const app = await db.app.findUnique({
      where: { id: appId },
    });
    return res.status(200).json({ app });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// http://localhost:3000/api/appRoutes?id=1
async function updateApp(req: NextApiRequest, res: NextApiResponse) {
  const appId = Number(req.query.id);
  const input: AppInput = req.body;
  // Validate the input data here

  try {
    const app = await db.app.update({
      where: { id: appId },
      data: {
        appName: input.appName,
        description: input.description,
        ownerId: input.ownerId,
        developers: input.developers,
        appLink: input.appLink,
        videoLink: input.videoLink,
        github: input.github,
        type: input.type,
        technologies: input.technologies,
      },
    });
    return res.status(200).json({ app });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// http://localhost:3000/api/appRoutes?id=1
async function deleteApp(req: NextApiRequest, res: NextApiResponse) {
  const appId = Number(req.query.id);
  try {
    await db.app.delete({
      where: { id: appId },
    });
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// http://localhost:3000/api/appRoutes
async function getAllApps(req: NextApiRequest, res: NextApiResponse) {
  try {
    const apps = await db.app.findMany();
    return res.status(200).json({ apps });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}