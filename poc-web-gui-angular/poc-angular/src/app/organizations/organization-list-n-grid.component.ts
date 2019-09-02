import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {columnFactory} from "@pebula/ngrid";
import {EntityListNGridComponent} from "../lib/entity-module/";
import {Organization} from "../core/domain/";
import {organizationMeta} from "./organization-meta";
import {OrganizationService} from "./organization.service";


const COLUMNS = columnFactory()
  .default({width: '180px'})
  .table(
    {prop: 'id', sort: true, pIndex: true, width: '60px'},
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
