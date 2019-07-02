import {EntityMeta} from "./domain/entity-meta.model";
import {Routes} from "@angular/router";
import {AuthGuardService} from "../auth-module";


export class EntityFactory<T extends Identifiable> {


  private meta: EntityMeta<T>;

  constructor(meta: EntityMeta<T>) {
    this.meta = meta;
  }

  public create<T>(type: { new(): T }): T {
    return new type();
  }


  public getMeta(): EntityMeta<T> {
    return this.meta
  }


  public buildRoutes(listComponent, entityComponent): Routes {
    return [
      {
        path: this.meta.namePlural,
        component: listComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: this.meta.namePlural + '/new',
        component: entityComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: this.meta.namePlural + '/:id',
        component: entityComponent,
        canActivate: [AuthGuardService]
      }
    ];

  }

}
