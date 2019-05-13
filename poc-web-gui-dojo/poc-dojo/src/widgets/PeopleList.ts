import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import Grid from '@dojo/widgets/grid';
import {FetcherOptions} from '@dojo/widgets/grid/interfaces';
import Link from '@dojo/framework/routing/Link';

import {Person, PocState} from "../interfaces";
import {
  ConfirmationPayload,
  PageSortFilterPayload,
  PartialPersonPayload,
  RouteIdPayload
} from "../processes/interfaces";
import {ThemedMixin} from "@dojo/framework/widget-core/mixins/Themed";
import * as css from './styles/PeopleList.m.css';

import Store from "@dojo/framework/stores/Store";
import {buildQueryString, getHeaders} from "../processes/utils";
import {peopleUrl} from "../../config";


export interface PeopleListProperties {
  store: Store<PocState>;
  storeId: string;
  fetchPeople: (opts: PageSortFilterPayload) => void;
  updatePerson: (opts: PartialPersonPayload) => void;

  createPerson: (opts: RouteIdPayload) => void;
  updatePeople: (opts: ConfirmationPayload) => void;
  deletePeople: (opts: ConfirmationPayload) => void;

  cancelPersonAction: (opts: Object) => void;

}


const columnConfig = [
  {
    id: "id",
    title: "ID",
    renderer: (item: any) => {
      return (
        w(Link, {
            to: "person",
            key: "person",
            classes: [css.link],
            params: {
              personId: item.value
            }
          },
          [item.value]
        )
      );
    }
  },
  {
    id: "firstName",
    title: "First Name",
    sortable: true,
    editable: true,
    filterable: true
  },
  {
    id: "lastName",
    title: "Last Name",
    sortable: true,
    editable: true,
    filterable: true
  },
  {
    id: "gender",
    title: "M/F",
    renderer: (item: any) => {
      return (
        (item.value == "MALE") ? "Man" : "Woman"
      );
    }
  },
  {
    id: "birthDate",
    title: "Birth date"
  },
  {
    id: "birthPlace",
    title: "Birth place",
    filterable: true
  }
];


export default class PeopleList extends ThemedMixin(WidgetBase)<PeopleListProperties> {


  protected render() {

    const {
      store,
      storeId,
      updatePerson
    } = this.properties;


    const fetcher = async (
      page: number,
      pageSize: number,
      options: FetcherOptions = {}
    ) => {
      const token = store.get(store.path('user', 'token'));

      const queryString = buildQueryString(page, pageSize, options);

      const response = await fetch(
        peopleUrl + queryString,
        {
          method: "get",
          headers: getHeaders(token)
        }
      );

      const json = await response.json();
      console.log(json);

      return {data: json.content, meta: {total: json.totalElements}};
    };

    const updater = async (person: Partial<Person>) => {
      await updatePerson({person: person});
    };

    return v('div', {classes: ['container', 'page']}, [
      v('h1', {}, ['People']),

      v('div', {classes: 'btn-toolbar', role: 'toolbar'}, [

        v('div', {classes: 'ml-auto'}, [

          v('button', {
            type: 'button',
            classes: ['btn', 'btn-outline-primary'],
            onclick: this._onBatchUpdatePeople,
          }, ['Update all']),

          v('button', {
            type: 'button',
            classes: ['btn', 'btn-outline-primary'],
            onclick: this._onBatchDeletePeople,
          }, ['Delete all']),

          v('button', {
            classes: ['btn', 'btn-primary'],
            type: 'button',
            onclick: this._onCreatePerson,
          }, ['Create person'])
        ])
      ]),

      w(Grid, {
        columnConfig: columnConfig,
        fetcher: fetcher,
        updater: updater,
        store: store,
        storeId: storeId,
        height: 720
      })
    ]);
  }

  private _onCreatePerson() {
    this.properties.createPerson({routeId: 'new-person'});
  }

  private _onBatchUpdatePeople() {

    const confirmationRequest = {
      action: 'update-people',
      confirming: false,
      confirmed: false,
      confirm: this.properties.updatePeople,
      cancel: this.properties.cancelPersonAction
    };

    this.properties.updatePeople({confirmationRequest: confirmationRequest});
  }


  private _onBatchDeletePeople() {

    const confirmationRequest = {
      action: 'delete-people',
      confirming: false,
      confirmed: false,
      confirm: this.properties.deletePeople,
      cancel: this.properties.cancelPersonAction
    };

    this.properties.deletePeople({confirmationRequest: confirmationRequest});
  }
}




