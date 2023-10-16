import { Developer, PrismaClient } from "@prisma/client";
import { signIn, SignInResponse } from "next-auth/react";

const prisma = new PrismaClient();

interface Profile {
  id: number;
  fullName: string;
  email: string;
  emailVerified: boolean;
  image: string;
  cohort: string;
  linkedin: string;
  password: string;
  appId: number | null;
}

async function signInCallback({
  profile,
}: {
  profile: Profile;
}): Promise<Developer | null | undefined> {
  // Check if the email is verified
  if (profile.emailVerified) {
    // If the email is verified, try to find the developer by email
    const developer = await prisma.developer.findUnique({
      where: {
        email: profile.email,
      },
      include: {
        app: true,
      },
    });

    if (developer) {
      // If developer is found, allow the user to sign in
      const signInResponse = await signIn("credentials", {
        user: developer as any, // Typecast developer to any, as signIn expects a more generic object
        redirect: false,
      });

      // If you need to handle errors in signInResponse, you can do it here.
      if (signInResponse?.error) {
        // Handle error, if any
        throw new Error(signInResponse.error);
      }
      return developer; // Return the developer as the promise resolves with Developer type
    }
  }

  // If the email is not verified or developer is not found, prevent the sign-in and throw an error
  throw new Error("Email not verified or developer not found.");
}

export default signInCallback;