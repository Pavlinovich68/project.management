import { BaseEntity } from "./BaseEntity";

export interface IBaseEntityRef {
   entity: (entity: BaseEntity | undefined) => void;
}