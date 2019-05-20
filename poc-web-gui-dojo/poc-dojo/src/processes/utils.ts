import {createCommandFactory} from '@dojo/framework/stores/process';
import {PocState} from '../interfaces';
import {FetcherOptions} from "@dojo/widgets/grid/interfaces";


export function buildQueryString(page: number, pageSize: number, options: FetcherOptions) {

  let queryString = "?page=" + (page - 1) + "&size=" + pageSize;

  let sortParams = "";
  if (options.sort != undefined) {
    sortParams += ((options.sort.columnId != undefined) ? "&sort=" + options.sort.columnId + "," : "");
    sortParams += (options.sort.direction != undefined) ? options.sort.direction : "asc";
  }
  queryString += sortParams;

  queryString += "&" + buildFilterQueryStringFromOptions(options);
  return queryString;
}

export function buildQueryStringForFilter(options: FetcherOptions) {
  return "?" + buildFilterQueryStringFromOptions(options);
}

function buildFilterQueryStringFromOptions(options: FetcherOptions): string {
  let filterParams = "";
  if (options.filter != undefined) {
    for (let columnId in options.filter) {
      let value = options.filter[columnId];
      if (value != null && value != "") {
        filterParams += columnId + "~" + value + ",";
      }
    }
    if (filterParams.length > 0) {
      filterParams = "filters=" + filterParams.substr(0, filterParams.length - 1);
    }
  }
  return filterParams;
}

export function objectToFormEncoded(object: { [index: string]: string }) {
  let encoded: string = '';
  let first = true;
  for (let key in object) {
    encoded += (first ? '' : '&') + key + '=' + object[key];
    first = false;
  }
  return encoded;
}


export function getHeaders(token?: string): any {
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  };
  if (token) {
    headers['Authorization'] = token;
  }
  return headers;
}

export const commandFactory = createCommandFactory<PocState>();


