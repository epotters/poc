import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {w} from '@dojo/framework/widget-core/d';
import Grid from '@dojo/widgets/grid';
import {FetcherOptions} from '@dojo/widgets/grid/interfaces';
import Link from '@dojo/framework/routing/Link';

import {Person, ResourceBased} from "../interfaces";
import {PageSortFilterPayload, PartialPersonPayload} from "../processes/interfaces";
import {ThemedMixin} from "@dojo/framework/widget-core/mixins/Themed";
import * as css from './styles/PeopleList.m.css';

export interface PeopleListProperties {
  people: Person[];
  meta: any;
  page: number;
  pageSize: number;
  options: FetcherOptions;
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


export default class PeopleList extends ThemedMixin(WidgetBase)<PeopleListProperties> implements ResourceBased {

  loading: boolean;
  loaded: boolean;

  protected render() {

    const {
      people,
      meta,
      fetchPeople,
      updatePerson
    } = this.properties;

    const fetcher = async (
      page: number,
      pageSize: number,
      options: FetcherOptions = {}
    ) => {
      await fetchPeople({page: page, pageSize: pageSize, options: options});
      console.log({data: people, meta: meta});
      return await {data: people, meta: meta};
    };

    const updater = async (person: Partial<Person>) => {
      await updatePerson({person: person});
    };

    return (
      w(Grid, {columnConfig: columnConfig, fetcher: fetcher, updater: updater, height: 720})
    );
  }
}

