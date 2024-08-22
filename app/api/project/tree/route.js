import prisma from "../../../../prisma/client";
import {NextResponse} from "next/server";

export const GET = async () => {
   try {
      const date = new Date();
      const data = await prisma.national_project.findMany({
         select: {
            id: true,
            project: {
               select: {
                  code: true,
                  short_name: true,
                  begin_date: true,
                  end_date: true
               }
            },
            regional_projects: {
               select: {
                  id: true,
                  project: {
                     select: {
                        code: true,
                        short_name: true,
                        begin_date: true,
                        end_date: true
                     }
                  }
               }
            }
         }
      });

      const result = data.filter((item) => item.project.begin_date < date && (item.project.end_date === null || item.project.end_date >= date)).map((item) => {
         const code = item.project.code.toLowerCase();
         const _items = item.regional_projects.filter((inner) => inner.project.begin_date < date && (inner.project.end_date === null || inner.project.end_date >= date)).map((inner) => {
            const innerCode = inner.project.code.toLowerCase();
            return {
               code: inner.project.code,
               label: inner.project.short_name,
               icon: `icon-np-${innerCode}  sb-project-${code}`,
               to: `/workplace/regionalproject/${inner.id}`
            }
         });
         _items.push({
               code: '!',
               label: 'Контракты',
               icon: `pi pi-briefcase sb-project-${code}`,
               to: `/workplace/contracts/${item.id}`
         });
         return {
            code: item.project.code,
            label: item.project.short_name,
            icon: `icon-np-${code} sb-project-${code}`,
            to: `/workplace/nationalproject/${item.id}`,
            items: _items.sort((a, b) => a.code.localeCompare(b.code))
         }
      }).sort((a, b) => a.code.localeCompare(b.code));
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}