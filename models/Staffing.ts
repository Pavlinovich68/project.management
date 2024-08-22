import { Employee } from "./Employee"

export interface Staffing {
   id?: number | undefined | null,
   name: string,
   additional: string,
   quantity: number,
   qnty: number,
   parent?: {
      id: number,
      name: string
   },
   employees?: [Employee]
}