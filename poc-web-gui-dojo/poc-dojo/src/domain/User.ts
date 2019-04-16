export class User {
  constructor(
      public id: number,
      public name: string,
      public displayName: string,
      public roles: string[]) {
  }
}