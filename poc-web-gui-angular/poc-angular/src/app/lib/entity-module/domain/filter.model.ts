

export interface FilterSet {
  // type: string;
  filters: Filter[];
}

export interface Filter {
    name: string;
    value: string;
}


/* Filter for one field */
export interface IFilter {
  id: string;
  filterData: string;
}




/*
Filter definition for one field of an entity
 */
// export interface EntityFieldFilter {
//   key: string;
//   filterData: string;
// }

/*
entityFilter is a Map<string, EntityFieldFilter> possably containing EntityFieldFilters for each field of an entity
EntityFieldFilters wil be combined using logical AND
*/

/*
A set of filters. Each will be applied using logical OR
 */
// export interface EntityFilterSet {
//   entityFilters: Map<string, EntityFieldFilter>[];
// }



