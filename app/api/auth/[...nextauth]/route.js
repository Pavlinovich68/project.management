import NextAuth from 'next-auth/next';
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { signJwtAccessToken } from '@/lib/jwt';
import prisma from "@/prisma/client";

export const authOptions = {
   adapter: PrismaAdapter(prisma),
   debug: true,
   providers: [
      CredentialsProvider({
         name: "credentials",
         credentials: {
            username: { label: "Username", type: "text", placeholder: "Имя пользователя"},
            password: { label: "Password", type: "password" },
            email: {label: "Email", type: "email" },
            roles: {label: "Roles", type: "json"},
            id: {label: "UserId", type: "id"}
         },
         async authorize(credentials) {
            if(!credentials.email || !credentials.password) {
               return null;
            }

            const user = await prisma.users.findUnique({
               where: {
                  email: credentials.email
               },
               include: {
                  division: true
               }
            });

            if (!user) {
               return null;
            }

            const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

            if (!passwordsMatch) {
               return null;
            }

            const { password, ...userWithoutPass } = user;
            const accessToken = signJwtAccessToken(userWithoutPass);

            const division = await prisma.division.findUnique({
               where: {
                  id: user.division.id
               }
            });

            user.avatar = user.avatar?.body;

            const result = {
               ...userWithoutPass,
               accessToken,
            }
            return result;
         }
      })
   ],
   session: {
      strategy: "jwt"
   },
   callbacks: {
      async jwt({token, user, session, account}){
         if (user) {
            token.division_id = user.division_id;
            token.division_name = user.division?.name
            token.roles = user.roles;
            token.avatar = user.attachment_id;
            token.user_id = user.id;
         }
         return token;
      },
      async session({session, user, token}){
         if (token) {
            session.user.division_id = token.division_id;
            session.user.division_name = token.division_name;
            session.user.roles = token.roles;
            session.user.avatar = token.avatar;
            session.user.id = token.user_id;
         }
         return session;
      }
   },
   secret: process.env.NEXTAUTH_SECRET,
   debug: process.env.NODE_ENV === "development"
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }