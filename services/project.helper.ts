import prisma from "@/prisma/client";

export default class ProjectHelper {
   static fullName = async (project_id: number, name: string | undefined): Promise<string | undefined> => {
      const project = await prisma.project.findUnique({where: {id: project_id}});
      let result: string | undefined = name ? `${project?.name}/${name}` : project?.name;
      if (project?.parent_id) {
         result = await this.fullName(project.parent_id, result);
      }
      return result;
   }
}