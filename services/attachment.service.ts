import minioClient from "@/lib/minio-client";
import CRUD from "@/models/enums/crud-type";
import prisma from "@/prisma/client";

class AttachService {
   drop = async (id: number | undefined | null) => {
      if (!id){
         return;
      }

      try {
         const record = await prisma.attachment.findFirst({where: {id: id}});
         if (!record)
            throw new Error("Не удалось найти запись в таблице вложений");
         await minioClient.removeObject(process.env.ROOT_BUCKET as string, `${record?.object_name}/${record?.filename}`);
         await prisma.attachment.delete({where: {id: record.id}});
      } catch (error) {
         throw error;
      }      
   }
}

export default new AttachService();