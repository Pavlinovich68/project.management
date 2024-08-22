import { BaseEntity } from "./BaseEntity";
import trafficLight from "./enums/traffic_light";

export interface ICantonResult {
   id?: number | undefined | null,
   division?: BaseEntity | undefined,
   project?: BaseEntity | undefined,
   traffic_light: trafficLight | undefined,
   desire: string | undefined,
   current: string  | undefined,
   risk: string  | undefined
}