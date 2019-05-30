import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {PeopleListComponent} from "./people/people-list.component";


const routes: Routes = [
  {
    path: 'people',
    component: PeopleListComponent
    // loadChildren: './people/people.module#PeopleModule'
  },
  {
    path: 'home',
    component: HomeComponent
    // loadChildren: './home/home.module#HomeModule'
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
