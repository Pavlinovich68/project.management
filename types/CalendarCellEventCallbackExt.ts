import { ICalendarCell } from "@/models/ICalendar";

export type CalendarCellEventCallbackExt = (e: ICalendarCell, rate_id: number, hoursDelta: number) => void;