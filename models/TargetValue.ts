import { BaseEntity } from "./BaseEntity";
import { TargetYearValue } from "./TargetYearValue";
import RecordState from "./enums/record-state";
import trafficLight from "./enums/traffic_light";

export interface TargetValue {
   id?:  number | undefined | null,
   target?: BaseEntity | undefined | null,
   name: string,
   isDiminishing: boolean,
   isVariation: boolean,
   unitVariation: number,
   percentVariation: number,
   trafficLight: trafficLight,
   deviationCauses: string,
   note: string,
   checkDate?: Date | null | undefined,
   state: RecordState,
   values: TargetYearValue[]
}