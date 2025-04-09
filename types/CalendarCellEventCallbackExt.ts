import { ICalendarCell } from "@/models/ICalendar";

export type CalendarCellEventCallbackExt = (e: ICalendarCell, rate_id: number, is_clear: boolean, hoursDelta: number) => void;