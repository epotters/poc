import {Identifiable} from '../../lib/entity-module';

export class Organization implements Identifiable {
  id: number;
  name: string;
}
