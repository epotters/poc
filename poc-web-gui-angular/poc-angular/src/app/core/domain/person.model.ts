export class Person implements Identifiable {
  id: number;
  firstName: string;
  prefix: string;
  lastName: string;
  gender: string;
  birthDate: string;
  birthPlace: string;
  household: string;

  fullName(): string {
    return this.firstName + ' ' + (this.prefix) ? this.prefix + ' ' : '' + this.lastName;
  }
}
