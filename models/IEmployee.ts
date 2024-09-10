export interface IEmployee {
   id: number | undefined;
   name: string | undefined;
   surname: string | undefined;
   pathname: string | undefined;
   email: string | undefined;
   begin_date: Date | undefined;
   end_date?: Date | null | undefined;

}