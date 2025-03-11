import CRUD from "@/models/enums/crud-type";

class AttachService {
   toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.readAsDataURL(file);
         reader.onload = () => resolve(reader.result as string);
         reader.onerror = (error) => reject(error);
   });

   read = async (id: number | undefined | null) => {
      if (!id){
         return;
      }
      const res = await fetch(`/api/attachment/read?id=${id}`, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         }
      });
      const data = await res.json();
      return data.status === 'success' ? data.data.body : '';
   }

   save = async(file: File, bucket_name: string) => {
      const base64 = await this.toBase64(file);
      const model = {
         type: file.type,
         filename: file.name,
         size: file.size,         
         body: base64
      }
      const res = await fetch(`/api/attachment/crud`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            operation: CRUD.create,
            params: {
               bucket_name: bucket_name,
               model: model
            }
         })
      });
      return await res.json();
   }

   download = async (id: number | undefined | null) => {
      if (id) {
         const res = await fetch(`/api/attachment/read?id=${id}`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
            }
         });
         const data = await res.json();
         if (data.status === 'success' && data.data.filename) {
            const link = document.createElement('a');
            link.href = data.data.body;
            link.download = data.data.filename;
            document?.body?.appendChild(link);
            link.click();
            document?.body?.removeChild(link);
         }
      }
   }
}

export default new AttachService();