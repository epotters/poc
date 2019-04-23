import {createCommandFactory} from '@dojo/framework/stores/process';
import {State} from '../interfaces';
import {FetcherOptions} from "@dojo/widgets/grid/interfaces";


export function buildQueryString(page: number, pageSize: number, options: FetcherOptions) {

  let queryString = "?page=" + (page - 1) + "&size=" + pageSize;

  let sortParams = "";
  if (options.sort != undefined) {
    sortParams += ((options.sort.columnId != undefined) ? "&sort=" + options.sort.columnId + "," : "");
    sortParams += (options.sort.direction != undefined) ? options.sort.direction : "asc";
  }
  queryString += sortParams;

  let filterParams = "";
  if (options.filter != undefined) {
    for (let columnId in options.filter) {
      let value = options.filter[columnId];
      if (value != null && value != "") {
        filterParams += columnId + "~" + value + ",";
      }
    }
    if (filterParams.length > 0) {
      filterParams = "&filters=" + filterParams.substr(0, filterParams.length - 1);
    }
  }
  queryString += filterParams;
  return queryString;
}

export function getHeaders(token?: string): any {
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  return headers;
}

export const commandFactory = createCommandFactory<State>();
