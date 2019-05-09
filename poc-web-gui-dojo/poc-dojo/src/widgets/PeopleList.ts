import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import Grid from '@dojo/widgets/grid';
import {FetcherOptions} from '@dojo/widgets/grid/interfaces';
import Link from '@dojo/framework/routing/Link';

import {Person, PocState} from "../interfaces";
import {PageSortFilterPayload, PartialPersonPayload} from "../processes/interfaces";
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
}

