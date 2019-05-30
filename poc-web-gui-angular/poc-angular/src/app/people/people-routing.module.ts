import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PeopleListComponent} from './people-list.component';
import {PersonComponent} from "./person.component";

const routes: Routes = [
  {
    path: 'people',
    component: PeopleListComponent
  },
  {
    path: 'people/new',
    component: PersonComponent
  },
  {
    path: 'people/:id',
    component: PersonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeopleRoutingModule {
}
