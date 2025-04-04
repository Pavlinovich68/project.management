
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

export interface ICalendarBaseRow {
   rate_id: number | undefined | null
   name: string | undefined | null
   employee_id: number | undefined | null
}

export interface ICalendarSum {
   rate_id: number | undefined | null
   sum: number | undefined | null
}

export interface ICalendarRow {
   rate_id: number | undefined | null,
   name: string | undefined | null,
   cells: ICalendarCell[] | undefined
   hours: number
   total: number | undefined
   employee_id: number | undefined | null
}

export interface ICalendarCell {
   day: number,
   type: number,
   hours: number
   checked: boolean
}

export interface ICalendarFooter {
   name: string | undefined,
   hours: ICalendarFooterItem[] | undefined,
   sum: number | undefined,
   total: number | undefined
}

export interface ICellProperty {
   type: number,
   hours: number
}

export interface ICalendarFooterItem {
   day: number,
   hours: number
}

export interface ICellDictionary {
   [key: number]: number | undefined;
}