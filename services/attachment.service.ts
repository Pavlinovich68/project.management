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

   save = async(file: File, id: number | undefined | null) => {
      const base64 = await this.toBase64(file);
      const model = {
         type: file.type,
         filename: file.name,
         size: file.size,
         //@ts-ignore
         date: file.lastModifiedDate,
         body: base64,
         id: id
      }
      const res = await fetch(`/api/attachment/upsert`, {
         method: "POST",
         //body: data,
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(model),
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