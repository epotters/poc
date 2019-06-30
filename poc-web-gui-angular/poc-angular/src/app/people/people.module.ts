import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MaterialModule} from "../material.module";
import {PeopleListComponent} from './people-list.component';
import {PersonComponent} from "./person.component";
import {PeopleRoutingModule} from './people-routing.module';
import {CdkTableModule} from "@angular/cdk/table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ApiService, PeopleService} from "../core/service";
import {ConfirmationDialogComponent} from "./confirmation-dialog.component";


@NgModule({
  imports: [
    CommonModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PeopleRoutingModule
  ],
  declarations: [
    PeopleListComponent,
    PersonComponent,
    ConfirmationDialogComponent
  ],
  entryComponents: [
    PeopleListComponent,
    PersonComponent,
    ConfirmationDialogComponent
  ],
  providers: [
    ApiService,
    // JwtService,
    PeopleService
  ]
})
export class PeopleModule {
}


