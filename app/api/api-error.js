export default class ApiError extends Error {
   status;
   errors;

   constructor(status, message, errors = []) {
      super(message);
      this.status = status;
      this.errors = errors;
   }

   static BadRequest(message, errors = []) {
      return new ApiError(400, message, errors);
   }

   static UnauthorizedError() {
      return new ApiError(401, 'Пользователь не авторизован')
   }

   static NotEnoughRights() {
      return new ApiError(402, 'У пользователя недостаточно прав для выполнения действия')
   }

   static AuthorizationError() {
      return new ApiError(600, 'Ошибка авторизации');
   }
}