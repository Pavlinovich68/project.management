import prisma from "@/prisma/client";
import {NextResponse} from "next/server";
import bcrypt from 'bcryptjs';

export const POST = async (request) => {
   try {
      const model = await request.json();      
      const userRecord = await prisma.users.findUnique({
         where: {
            id: parseInt(model.id),
            restoreGuid: model.token
         }
      });
      if (!userRecord) {
         return await NextResponse.json({
            bad: true,
            note: `Пользователь не найден!`
         });
      }
         

      if (!userRecord.restoreTime) {
         const result = {
            bad: true,
            note: `Пользователь не запрашивал сброс пароля!`
         };
         return await NextResponse.json(result);
      }

      const now = new Date();
      if (now > userRecord.restoreTime) {
         const result = {
            bad: true,
            note: `Время на изменение пароля истекло, попробуйте заново!`
         };
         return await NextResponse.json(result);
      }
         
      const hashedPassword = await bcrypt.hashSync(model.password, 8);

      const _users = await prisma.users.update({
         where: {
            id: userRecord.id
         },
         data: {
            password: hashedPassword,
            restoreGuid: null,
            restoreTime: null
         }
      });     

      const result = {
         bad: false,
         note: `Войдите в систему с новым паролем!`
      };
      return await NextResponse.json(result);
   } catch (e) {
      result = {
         bad: true,
         note: e.message
      };
      return await NextResponse.json(result);
   }
}