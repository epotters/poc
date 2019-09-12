import {InjectionToken} from "@angular/core";
import {EntityMeta} from "./domain/entity-meta.model";
import {EntityService} from "./entity.service";


export const META = new InjectionToken<EntityMeta<any>>('Entity Meta');
export const SERVICE = new InjectionToken<EntityService<any>>('Entity Service');

