import NextAuth, { Account, Profile, User } from 'next-auth'
// import Auth0Provider from "next-auth/providers/auth0";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from '@/lib/db';
import { JWT } from 'next-auth/jwt';
import { AdapterUser } from 'next-auth/adapters';


export default NextAuth({
    adapter: PrismaAdapter(db),
    providers: [],
    secret: process.env.NEXTAUTH_SECRET,
    session:{
        strategy: "jwt",
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