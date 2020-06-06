import {Identifiable}from '@epotters/entities/lib';

export class Organization implements Identifiable {
  id: number;
  name: string;
}
