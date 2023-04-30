import NextAuth, { Account, Profile, User } from 'next-auth'
// import Auth0Provider from "next-auth/providers/auth0";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from '@/lib/db';
import { JWT } from 'next-auth/jwt';
import { AdapterUser } from 'next-auth/adapters';
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";

export default NextAuth({
    adapter: PrismaAdapter(db),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "email", type: "text", placeholder: "example@example.com" },
                password: { label: "Password", type: "password"}
            },
            async authorize(credentials) {
                await db.$connect();
                const developer = await db.developer.findUnique({where:{email: credentials!.email}});
                if (!developer) {
                    throw new Error("Email is not registered.")
                }
                const isPasswordCorrect = await bcrypt.compare(
                    credentials!.password,
                    developer.password
                );
                if (!isPasswordCorrect) {
                    throw new Error("Password is incorrect.")
                }
                return developer;
            }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session:{
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth",
    },
    callbacks:{
        async jwt({ token, user, account, profile, isNewUser }: 
            {
                token: JWT;
                user: User | AdapterUser;
                account: Account | null;
                profile?: Profile | undefined;
                isNewUser?: boolean | undefined;
                session?: any;
            }) {
            console.log(account)
            return token
        }
    }

})