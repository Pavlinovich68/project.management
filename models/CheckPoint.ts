import { BaseProject } from "./BaseProject";
import trafficLight from "./enums/traffic_light";

export interface CheckPoint {
   id?: number | undefined | null,
   project?: BaseProject,
   trafficLight: trafficLight,
   plan: number,
   fact: number,
   note: string
}