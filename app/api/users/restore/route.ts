import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";
import mailService  from '@/services/mail.service'
import { env } from "process";
import GuidHelper from "@/services/guid.helper";

export const POST = async (request: NextRequest) => {
   //@ts-ignore
   Date.prototype.addHour= function(){
      this.setHours(this.getHours()+1);
      return this;
   };

   try {
      const model = await request.json();
      if (!model.email) return;
      const userRecord = await prisma.users.findFirst({where: {email: model.email}});
      if (!userRecord)
         throw new Error(`Пользователь с адресом электронной почты ${model.email} не найден среди пользователей системы! Обратитесь к администратору.`);

      //@ts-ignore
      const limitTime = new Date().addHour(1);
      const guid = GuidHelper.newGuid();

      await prisma.users.update({
         where: {
            id: userRecord.id
         },
         data: {
            restoreGuid: guid,
            restoreTime: limitTime
         }
      });

      const link = `${process.env.NEXTAUTH_URL}/restore/${userRecord.id}/${guid}`;

      const result = await mailService.restoreLink(model.email, link);
      return await NextResponse.json({result: result});
   } catch (e) {
      console.log(e);
      return await NextResponse.json({result: false});
   }
}