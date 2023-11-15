import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "./helpers/jwt";
import { NextApiRequest, NextApiResponse } from "next";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const protectedRoutes = ["/profile", "/add-app", "/edit-app"];
  if (protectedRoutes.includes(pathname) && !session) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth`);
  }
}

export function authenticate(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const accessToken: string = req.headers.authorization;
  const decoded = verifyJwt(accessToken);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid authorization token" });
  }
  // If the token is valid, call the next function in the middleware chain
  next();
}