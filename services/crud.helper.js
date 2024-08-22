class CrudHelper {
   crud = async(controller, operation, model, params) => {
      const res = await fetch(`/api/${controller}/crud`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({operation: operation, model: model, params: params}),
      });
      return await res.json();
   }
}

export default new CrudHelper();