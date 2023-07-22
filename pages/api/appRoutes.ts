import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import validator from 'validator';
import { AppDataProps} from '@/components/types';


export default async function createAppHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case 'POST':
      return createApp(req, res);
    case 'GET':
      const appId = Number(req.query.id);
      const searchTerm = req.query.search as string;
      if (!isNaN(appId)) {
        return getOneApp(req, res);
      } else {
        return getAllApps(req, res);
      }
    case 'PUT':
      return updateApp(req, res);
    case 'DELETE':
      return deleteApp(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function createApp(req: NextApiRequest, res: NextApiResponse) {
  try {
    const input = req.body;
    const errors = [];

    if (!input.appName) {
      errors.push('App name is required.');
    }

    if (!input.developers || input.developers.length === 0) {
      errors.push('At least one developer is required.');
    }

    if (!input.type) {
      errors.push('App type is required.');
    }

    if (!input.github || !validator.isURL(input.github)) {
      errors.push('Please enter a valid GitHub URL.');
    }

    if (input.technologies && input.technologies.length > 5) {
      errors.push('Please add a maximum of 5 technologies.');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const app = await db.app.create({
      data: {
        appName: input.appName,
        description: input.description,
        appLink: input.appLink,
        videoLink: input.videoLink,
        github: input.github,
        type: input.type,
        technologies: input.technologies
      },
    });

    const developerNames = input.developers.map((developer: { fullName: string }) => developer.fullName);
    const developers = await db.developer.findMany({
      where: {
        fullName: {
          in: developerNames,
        },
      },
    });

    await Promise.all(
      developers.map(async (developer) => {
        await db.developer.update({
          where: { id: developer.id },
          data: {
            app: { connect: { id: app.id } },
          },
        });
      })
    );

    return res.status(201).json({ app });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getOneApp(req: NextApiRequest, res: NextApiResponse) {
  const appId = Number(req.query.id);

  try {
    const app = await db.app.findUnique({
      where: { id: appId },
      include: {
        developers: true,
      },
    });

    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }

    return res.status(200).json({ app });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateApp(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query as { id: string };
    const input: AppDataProps = req.body as AppDataProps;
    const errors: string[] = [];

    if (!input.appName) {
      errors.push('App name is required.');
    }

    if (!input.developers || input.developers.length === 0) {
      errors.push('At least one developer is required.');
    }

    if (!input.type) {
      errors.push('App type is required.');
    }

    if (!input.github || !validator.isURL(input.github)) {
      errors.push('Please enter a valid GitHub URL.');
    }

    if (input.technologies && input.technologies.length > 5) {
      errors.push('Please add a maximum of 5 technologies.');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const existingApp = await db.app.findUnique({ where: { id: Number(id) } });

    if (!existingApp) {
      return res.status(404).json({ message: 'App not found.' });
    }

    const updatedApp = await db.app.update({
      where: { id: Number(id) },
      data: {
        appName: input.appName,
        description: input.description,
        appLink: input.appLink,
        videoLink: input.videoLink,
        github: input.github,
        type: input.type,
        technologies: input.technologies,
        developers: {
          connect: input.developers.map((developer) => ({ id: developer.id }))
        }
      }
    });

    console.log(updatedApp)
    return res.status(200).json({ app: updatedApp });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
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

async function getAllApps(req: NextApiRequest, res: NextApiResponse) {
  try {
    const apps = await db.app.findMany({
      include: {
        developers: true,
      },
    });
    return res.status(200).json({ apps });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

