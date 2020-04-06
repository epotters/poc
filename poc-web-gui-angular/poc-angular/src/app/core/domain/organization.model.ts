import {Identifiable} from 'entity-lib/lib';

export class Organization implements Identifiable {
  id: number;
  name: string;
}
