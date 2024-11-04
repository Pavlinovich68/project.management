export interface IEmployee {
   id: number | undefined;
   name: string | undefined;
   email: string | undefined;
   contacts: string | undefined;
   begin_date: Date | undefined;
   end_date?: Date | null | undefined;

}