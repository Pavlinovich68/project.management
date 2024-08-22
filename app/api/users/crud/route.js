import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {appRoles} from "@/prisma/roles/index";
import {NextResponse} from "next/server";
import bcrypt from 'bcryptjs';
import CRUD from "@/models/enums/crud-type.ts"
import mailService from "@/services/mail.service";

export const POST = async (request) => {
   const generatePassword = () => {
      let length = 8,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*",
      retVal = "";
      for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
   }

   const create = async (model) => {
      const _exists = await prisma.users.findFirst({
         where: {
            email: {
               equals: model.email.trim(),
               mode: 'insensitive'
            }
         }
      })

      if (_exists) {
         throw new Error(`Пользователь с почтовым адресом ${model.email} уже существует!`);
      }

      const password = generatePassword();
      const hashedPassword = await bcrypt.hashSync(password, 8);

      const selectedRoles = model.roles.filter((i) => i.active);
      const roles = {};
      for (const role of selectedRoles) {
         roles[role.role] = role.name;
      }

      //TODO Отправка пароля на почту
      await mailService.newUser(model.email, password);

      const result = await prisma.users.create({
         data: {
            name: model.name,
            email: model.email.trim(),
            contacts: model.contacts,
            begin_date: new Date(model.begin_date),
            end_date: model.end_date !== null ? new Date(model.end_date) : null,
            roles: roles,
            division_id: model.division_id,
            password: hashedPassword,
            attachment_id: model.attachment_id
         }
      });

      return result;
   }

   const read = async (model) => {
      let filter = {};
      if (model.searchStr) {
         filter['OR'] = prismaHelper.OR(['name', 'email', 'division.name'], model.searchStr);
         if (!model.showClosed) {
            filter['AND'] = [{ OR: [{ end_date: null }, { end_date: { gt: new Date() } }]}];
         }
      } else {
         if (!model.showClosed) {
            filter['OR'] = [{end_date: null}, {end_date: { gt: new Date() }}];
         }
      }

      const totalCount = await prisma.users.count({where: filter});
      const result = await prisma.users.findMany({
         skip: model.pageSize * (model.pageNo -1),
         take: model.pageSize,
         where: filter,
         orderBy: model.orderBy,
         include: {division: true}
      });

      for (const user of result) {
         user.roles = Object.entries(appRoles).map((role) => {
            return {
               role: role[0],
               name: role[1],
               active: user.roles[role[0]] !== undefined
            }
         });
      }

      let data = {
         recordCount: totalCount,
         pageCount: Math.ceil(totalCount / model.pageSize),
         pageNo: model.pageNo,
         pageSize: model.pageSize,
         result: result
      };
      return data;
   }

   const update = async (model) => {
      const selectedRoles = model.roles.filter((i) => i.active);
      const roles = {};
      for (const role of selectedRoles) {
         roles[role.role] = role.name;
      }
      const result = await prisma.users.update({
         where: {id: model.id},
         data: {
            name: model.name,
            email: model.email,
            contacts: model.contacts,
            begin_date: new Date(model.begin_date),
            end_date: model.end_date !== null ? new Date(model.end_date) : null,
            roles: roles,
            division_id: model.division_id,
            attachment_id: model.attachment_id
         }
      });

      return result;
   }

   const drop = async (model) => {
      const result = await prisma.users.update({
         where: {id: model.id},
         data: {
            end_date: new Date()
         }
      });
      return result;
   }

   const { operation, model } = await request.json();
   try {
      let result = null;
      switch (operation) {
         case CRUD.read:
            result = await read(model);
            break;
         case CRUD.create:
            result = await create(model);
            break;
         case CRUD.update:
            result = await update(model);
            break;
         case CRUD.delete:
            result = await drop(model);
            break;
      }
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}