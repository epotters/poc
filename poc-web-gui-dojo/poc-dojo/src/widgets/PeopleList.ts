import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {w} from '@dojo/framework/widget-core/d';
import Grid from '@dojo/widgets/grid';
import {FetcherOptions} from '@dojo/widgets/grid/interfaces';
import Link from '@dojo/framework/routing/Link';
import {baseUrl} from '../../config';
import * as css from './styles/PeopleList.m.css';

// import {listPeopleProcess} from '../processes/personProcesses';

import {Person} from "../interfaces";


export interface PeopleListProperties {
  people: Person[];
  page: number;
  pageSize: number;
  options: FetcherOptions;
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
};


const updater = async (item: any) => {
  await fetch(baseUrl + `${item.id}`, {
    method: 'POST',
    body: JSON.stringify(item),
    headers: {
      "Content-Type": "application/json"
    }
  });
};


export default class PeopleList extends WidgetBase {
  protected render() {
    return (
        w(Grid, {columnConfig: columnConfig, fetcher: fetcher, updater: updater, height: 720})
    );
  }
}

