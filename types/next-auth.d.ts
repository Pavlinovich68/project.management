import NextAuth, {DefaultSession, DefaultUser} from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
import { IDictionary } from "./IDictionary";

declare module "next-auth" {
   interface Session {
      user: {
         id: number,
         division_id: number,
         roles: IDictionary | undefined,         
         password: string
      } & DefaultSession["user"]
   }
   interface User extends DefaultUser {
      roles: string[],
   }

   declare module  "next-auth/jwt"  { 
      interface JWT extends DefaultJWT  {
         user:  {
            id: number,
            division_id: number,
            roles: IDictionary | undefined,
            password: string
         } & DefaultJWT["user"]
      }
   }
}