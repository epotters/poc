import {Identifiable} from '../../lib/entity-lib';

export class Organization implements Identifiable {
  id: number;
  name: string;
}
