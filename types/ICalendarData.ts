export interface ICalendarHeader {
   days: ICalendarHeaderItem[] | undefined;
}

export interface ICalendarHeaderItem {
   day: number | undefined;
   type: number | undefined;
   background_class: number | undefined;
   text_class: number | undefined;
}
export interface ICalendarRow {
   name: string | undefined | null,
   hours: ICalendarRowItem[] | undefined;
   total: number;
}

export interface ICalendarRowItem {
   day: number | undefined;
   value: number;
   background_class: string | undefined;
   text_class: string | undefined;
}

export interface ICalendarFooter {
   days: ICalendarRowItem[];
   total: number | undefined;
}

export interface ICalendarData {
   header: ICalendarHeader | undefined;
   rows: ICalendarRow[] | undefined;
   footer: ICalendarFooter | undefined;
}