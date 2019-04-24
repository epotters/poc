import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {w} from '@dojo/framework/widget-core/d';
import Grid from '@dojo/widgets/grid';
import {FetcherOptions} from '@dojo/widgets/grid/interfaces';
import Link from '@dojo/framework/routing/Link';
import {baseUrl} from '../../config';
import * as css from './styles/PeopleList.m.css';
import {Person} from "../interfaces";
import {PageSortFilterPayload, PartialPersonPayload} from "../processes/interfaces";
import {ThemedMixin} from "@dojo/framework/widget-core/mixins/Themed";


export interface PeopleListProperties {
  people: Person[];
  page: number;
  pageSize: number;
  options: FetcherOptions;
  meta: any;
  listPeople: (opts: PageSortFilterPayload) => void;
  updatePerson: (opts: PartialPersonPayload) => void;
}


const columnConfig = [
  {
    id: "id",
    title: "ID",
    renderer: (item: any) => {
      console.log(item);
      return (
          w(Link, {
                to: "person",
                key: "person",
                classes: [css.link],
                // activeClasses: [css.linkSelected],
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


const fetcher = async (
    page: number,
    pageSize: number,
    options: FetcherOptions = {}
) => {
  return this.properties.listPeople();
};


const updater = async (person: Partial<Person>) => {
  await fetch(baseUrl + `${person.id}`, {
    method: 'post',
    body: JSON.stringify(person),
    headers: {
      "Content-Type": "application/json"
    }
  });
};

/*
const gridProps: GridProperties = {};

export interface GridProperties<S> extends ThemedProperties {
    columnConfig: ColumnConfig[];
    fetcher: Fetcher<S>;
    height: number;
    updater?: Updater<S>;
    store?: Store<S>;
    storeId?: string;
    customRenderers?: CustomRenderers;
}
 */




export default class PeopleList extends ThemedMixin(WidgetBase)<PeopleListProperties> {


  protected render() {

    const {
      listPeople
    } = this.properties;

    const fetcher = async (
        page: number,
        pageSize: number,
        options: FetcherOptions = {}
    ) => {
      return listPeople({page: page, pageSize: pageSize, options: options});
    };

    return (
        w(Grid, {columnConfig: columnConfig, fetcher: fetcher, updater: updater, height: 720})
    );
  }
}

