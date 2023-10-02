import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import validator from "validator";
import { AppDataProps } from "@/components/types";

export default async function createAppHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return createApp(req, res);
    case "GET":
      const appId = Number(req.query.id);
      if (!isNaN(appId)) {
        return getOneApp(req, res);
      } else {
        return getAllApps(req, res);
      }
    case "PUT":
      return updateApp(req, res);
    case "DELETE":
      return deleteApp(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function createApp(req: NextApiRequest, res: NextApiResponse) {
  try {
    const input = req.body;
    const errors = [];
    const messages: string[] = [];

    if (!input.signedInUser) {
      errors.push("Please login to continue.");
    } else {
      const signedInUser = await db.developer.findUnique({
        where: {
          email: input.signedInUser,
        }
      });

      if (!signedInUser) {
        errors.push("User not found.");
      }

      if (signedInUser?.appId) {
        errors.push("User already has an app.");
      }
    }
    if (!input.appName) {
      errors.push("App name is required.");
    }

    if (!input.developers || input.developers.length === 0) {
      errors.push("At least one developer is required.");
    }

    if (!input.type) {
      errors.push("App type is required.");
    }

    if (!input.github || !validator.isURL(input.github)) {
      errors.push("Please enter a valid GitHub URL.");
    }

    if (input.technologies && input.technologies.length > 5) {
      errors.push("Please add a maximum of 5 technologies.");
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
        technologies: input.technologies,
      },
    });

    
    const developerNames = input.developers.map(
      (developer: { fullName: string }) => developer.fullName
    );
    const developers = await db.developer.findMany({
      where: {
        appId: null,
        fullName: {
          in: developerNames,
        },
      },
    });

    if (developerNames.length > developers.length){
      const developersSet = new Set(developerNames)
      for (let developer of developers){
        if ( developersSet.has(developer.fullName)){
          developersSet.delete(developer.fullName)
        }
      }
      console.log("App will be created for all users except: ", developersSet);
      messages.push("App will be created for all users except:")
      for (const invalidDev in developersSet){
        messages.push(invalidDev);
      }
    };



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

    return res.status(201).json({ app, messages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
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
      return res.status(404).json({ message: "App not found" });
    }

    return res.status(200).json({ app });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateApp(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query as { id: string };
    const input: AppDataProps = req.body as AppDataProps;
    const errors: string[] = [];

    if (!input.signedInUser) {
      errors.push("Please login to continue.");
    } else {
      const signedInUser = await db.developer.findUnique({
        where: {
          email: input.signedInUser,
        },
      });

      if (!signedInUser) {
        errors.push("User not found.");
      }

      if (signedInUser?.appId != input.id) {
        errors.push(
          "User doesn't have permissions to submit changes on this app."
        );
      }
    }
    if (!input.appName) {
      errors.push("App name is required.");
    }

    if (!input.appName) {
      errors.push("App name is required.");
    }

    if (!input.developers || input.developers.length === 0) {
      errors.push("At least one developer is required.");
    }

    if (!input.type) {
      errors.push("App type is required.");
    }

    if (!input.github || !validator.isURL(input.github)) {
      errors.push("Please enter a valid GitHub URL.");
    }

    if (input.technologies && input.technologies.length > 5) {
      errors.push("Please add a maximum of 5 technologies.");
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const existingApp = await db.app.findUnique({ where: { id: Number(id) } });

    if (!existingApp) {
      return res.status(404).json({ message: "App not found." });
    }

    const appLink = input.appLink !== null ? input.appLink : undefined;

    const updatedDevs = await db.developer.updateMany({
      where: { appId: Number(id) },
      data: {
        appId: null,
      },
    });

    const updatedApp = await db.app.update({
      where: { id: Number(id) },
      data: {
        appName: input.appName,
        description: input.description,
        appLink: appLink,
        videoLink: input.videoLink,
        github: input.github,
        type: input.type,
        technologies: input.technologies,
        developers: {
          connect: input.developers.map((developer) => ({ id: developer.id })),
        },
      },
      include: {
        developers: true,
      },
    });

    return res.status(200).json({ app: updatedApp });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteApp(req: NextApiRequest, res: NextApiResponse) {
  const appId = Number(req.query.id);

  try {
    // Find the app to be deleted
    const app = await db.app.findUnique({
      where: { id: appId },
      include: {
        developers: true,
      },
    });

    if (!app) {
      return res.status(404).json({ message: "App not found." });
    }

    if (app.developers.length > 1) {
      return res.status(400).json({
        message:
          "You cannot delete this app because it has multiple developers.",
      });
    }

    // Delete the app
    await db.app.delete({
      where: { id: appId },
    });

    return res.json({ message: `App with ID ${appId} has been deleted.` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
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
    return res.status(500).json({ message: "Internal server error" });
  }
}
