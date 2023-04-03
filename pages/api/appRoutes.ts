// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Developers, Apps } from '@prisma/client';
import { db } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    await createApp(req, res);
    // const { name } = req.body;
    res.status(201).json({ data: { message: `App: ${req.body.appName} successfully created` } });
  } else {
    res.status(400).json({ message: 'Method not allowed.' });
  }
}

const createApp = async ( req: NextApiRequest, res: NextApiResponse) => {
  const id: number = req.body.id;
  const appName : string = req.body.appName;
  const description: string = req.body.description;
  const developer: Developers[] = req.body.developer;
  const appLink: string = req.body.appLink;
  const videoLink: string = req.body.videoLink;
  const github: string = req.body.github;
  const type: string = req.body.type;
  const technologies: string = req.body.technologies;

  await db.apps.create({data: {id, appName, description, developer, appLink, videoLink, github, type, technologies}})
}






// model Developers {
//   id      Int      @id @default(autoincrement())
//   name    String
//   email   String   @unique
//   linkedin String?
//   app       Apps     @relation(fields: [app_id], references: [id])
//   app_id    Int      @unique
// }

// model Apps {
//   id      Int      @id @default(autoincrement())
//   appName   String
//   description String
//   developer  Developers[]
//   appLink String?
//   videoLink String?
//   github String?
//   type String
//   technologies String[]
// }
