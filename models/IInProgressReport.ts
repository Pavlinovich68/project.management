export interface IInProgressReport {
   id: number,
   month: number,
   day: number,
   hours: number,
   work_type: number,
   note: string,
   project: {
      id: number,
      name: string
   }
}