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

            const preUser = await prisma.users.findFirst({
               where: {
                  employee: {
                     email: credentials.email
                  } 
               },
               select: {
                  id: true,
                  password: true,
                  employee_id: true,
                  roles: true,
                  attachment_id: true,
                  employee: {
                     select: {
                        email: true,
                        name: true
                     }
                  }
               }
            });

            if (!preUser) return null;

            const currentDate = new Date();
            const staff = await prisma.staff.findFirst({
               where: {
                  AND: [
                     {
                        employee_id: preUser.employee_id
                     },
                     {
                        begin_date: {
                           lte: currentDate
                        }
                     },
                     {
                        OR: [
                           {
                              end_date: null 
                           },
                           {
                              end_date: {
                                 gt: currentDate
                              }
                           }
                        ]
                     }
                  ]
                  
               },
               include: {                  
                  rate: {
                     include: {
                        division: true
                     }
                  }
               }
            })

            if (!staff) {
               return null;
            }

            const user = {...preUser, division_id: staff.rate.division_id, division: {name: staff.rate.division.name}, name: preUser.employee.name, email: preUser.employee.email};

            const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

            if (!passwordsMatch) {
               return null;
            }

            const { password, ...userWithoutPass } = user;
            const accessToken = signJwtAccessToken(userWithoutPass);

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
            token.employee_id = user.employee_id;
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
            session.user.employee_id = token.employee_id;
         }
         return session;
      }
   },
   secret: process.env.NEXTAUTH_SECRET,
   debug: process.env.NODE_ENV === "development"
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }