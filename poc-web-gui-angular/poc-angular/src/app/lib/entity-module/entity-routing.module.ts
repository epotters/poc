// import {NgModule} from '@angular/core';
// import {RouterModule, Routes} from '@angular/router';
// import {AuthGuardService} from "../auth-module/";
// import {EntityComponent} from "./entity.component";
// import {EntityListComponent} from "./entity-list.component";
// import {MetaConfig} from "../../meta-config";
//
//
// const meta = MetaConfig.metas.get('person');
//
// const routes: Routes = [
//   {
//     path: meta.namePlural,
//     component: EntityListComponent,
//     canActivate: [AuthGuardService]
//   },
//   {
//     path: meta.namePlural + '/new',
//     component: EntityComponent,
//     canActivate: [AuthGuardService]
//   },
//   {
//     path: meta.namePlural + '/:id',
//     component: EntityComponent,
//     canActivate: [AuthGuardService]
//   }
// ];
//
// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class EntityRoutingModule<T extends Identifiable> {
// }
