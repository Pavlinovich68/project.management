import { BaseProject } from "./BaseProject";
import trafficLight from "./enums/traffic_light";

export interface WaitingResult {
   id?: number | undefined | null,
   project?: BaseProject,
   division?:  BaseProject,
   trafficLight: trafficLight,
   text: string,
   status: string,
   risk: string
}