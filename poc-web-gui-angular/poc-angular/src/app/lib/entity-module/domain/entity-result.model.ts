export interface EntityResult<T extends Identifiable> {
  total: number;
  entities: T[]
}
