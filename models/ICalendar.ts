import { IBaseEntity } from "./IBaseEntity";

export interface ICalendar {
   year: number | undefined,
   month: number | undefined,
   header: ICalendarHeader | undefined
   rows: ICalendarRow[] | undefined,
   footer: ICalendarFooter | undefined
}

export interface ICalendarHeader {
   name: string | undefined,
   days: number[] | undefined,
   hours: string | undefined,
   total: string | undefined
}

export interface ICalendarRow {
   name: string | undefined,
   cells: ICalendarCell[] | undefined
   hours: number | undefined
   total: number | undefined
}

export interface ICalendarCell {
   day: number,
   type: number,
   hours: number
}

export interface ICalendarFooter {
   name: string | undefined,
   hours: number[] | undefined,
   sum: number | undefined,
   total: number | undefined
}