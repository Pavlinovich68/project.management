import { IBaseEntity } from "./IBaseEntity";

export interface IBaseEntityRef {
   entity: (entity: IBaseEntity | undefined) => void;
}