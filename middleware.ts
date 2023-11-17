import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
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

export async function authenticateByToken(req: NextApiRequest) {
  const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
  });
  
  return token;
}
