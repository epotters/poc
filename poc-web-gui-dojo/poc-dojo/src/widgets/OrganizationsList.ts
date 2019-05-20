import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import Grid from '@dojo/widgets/grid';
import {FetcherOptions} from '@dojo/widgets/grid/interfaces';
import Link from '@dojo/framework/routing/Link';

import {Organization, PocState} from "../interfaces";
import {PageSortFilterPayload, PartialOrganizationPayload} from "../processes/interfaces";
import {ThemedMixin} from "@dojo/framework/widget-core/mixins/Themed";
import * as css from './styles/OrganizationsList.m.css';

import Store from "@dojo/framework/stores/Store";
import {buildQueryString, getHeaders} from "../processes/utils";
import {organizationsUrl} from "../../config";


export interface OrganizationsListProperties {
  store: Store<PocState>;
  storeId: string;
  fetchOrganizations: (opts: PageSortFilterPayload) => void;
  updateOrganization: (opts: PartialOrganizationPayload) => void;
}


const columnConfig = [
  {
    id: "id",
    title: "ID",
    renderer: (item: any) => {
      return (
        w(Link, {
            to: "organization",
            key: "organization",
            classes: [css.link],
            params: {
              organizationId: item.value
            }
          },
          [item.value]
        )
      );
    }
  },
  {
    id: "name",
    title: "Name",
    sortable: true,
    editable: true,
    filterable: true
  }
];


export default class OrganizationsList extends ThemedMixin(WidgetBase)<OrganizationsListProperties> {


  protected render() {

    const {
      store,
      storeId,
      updateOrganization
    } = this.properties;


    const fetcher = async (
      page: number,
      pageSize: number,
      options: FetcherOptions = {}
    ) => {
      const token = store.get(store.path('session', 'token'));

      const queryString = buildQueryString(page, pageSize, options);

      const response = await fetch(
        organizationsUrl + queryString,
        {
          method: "get",
          headers: getHeaders(token)
        }
      );

      const json = await response.json();
      console.log(json);

      return {data: json.content, meta: {total: json.totalElements}};
    };


    const updater = async (organization: Partial<Organization>) => {
      await updateOrganization({organization: organization});
    };

    return [
      v('h1', {classes: []}, ['Organizations']),
      w(Grid, {
        columnConfig: columnConfig,
        fetcher: fetcher,
        updater: updater,
        store: store,
        storeId: storeId,
        height: 720
      })
    ];
  }
}

