import {Identifiable} from "./identifiable.model";

export interface EntityResult<T extends Identifiable> {
  total: number;
  entities: T[]
}
