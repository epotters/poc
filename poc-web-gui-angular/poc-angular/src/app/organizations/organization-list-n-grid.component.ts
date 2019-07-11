
import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import {MatDialog} from "@angular/material";

import {columnFactory} from "@pebula/ngrid";

import {EntityListNGridComponent} from "../lib/entity-module/";


import {Organization} from "../core/domain/";
import {organizationMeta} from "./organization-meta";
import {OrganizationService} from "./organization.service";
import {animate, state, style, transition, trigger} from "@angular/animations";



const COLUMNS = columnFactory()
  // .default({width: '100px', reorder: true, resize: true})

  .default({width: '150px'})
  .table(
    // { prop: 'drag_and_drop_handle', type: 'drag_and_drop_handle', minWidth: 24, width: '', maxWidth: 24, wontBudge: true, resize: false, },
    // { prop: 'selection',  minWidth: 48, width: '', maxWidth: 48, wontBudge: true, resize: false, },

    {prop: 'id', sort: true, width: '40px'}, // wontBudge: true
    {prop: 'name', sort: true}
  )
  .header(
    {rowClassName: 'pbl-groupby-row'},
    {id: 'pbl-groupby-row', type: 'pbl-groupby-row', label: ' '},
  );



@Component({
  selector: 'organization-list-n-grid',
  templateUrl: './organization-list-n-grid.component.html',
  styleUrls: [],

  animations: [
    trigger('detailExpand', [
      state('void', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('*', style({height: '*', visibility: 'visible'})),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OrganizationListNGridComponent extends EntityListNGridComponent<Organization> {

  constructor(
    public service: OrganizationService
  ) {
    super(organizationMeta, service, COLUMNS.build());
  }

}
