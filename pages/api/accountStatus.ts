import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Developer } from "@prisma/client";
import { db } from "@/lib/db";

interface AccountStatusResponse {
    isDeleted: boolean;
}

export default async function accountStatus(
    req: NextApiRequest,
    res: NextApiResponse<AccountStatusResponse>
    ): Promise<void> {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ isDeleted: false });
    }

    const signedInUser = await db.developer.findUnique({
        where: {
        email: session.user?.email!,
        },
    });

    if (!signedInUser) {
        return res.status(401).json({ isDeleted: true });
    }

    res.status(200).json({ isDeleted: false });
}