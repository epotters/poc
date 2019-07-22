
/* Filter for one field */
export interface FieldFilter {
  name: string;
  rawValue: string;
}



// export interface FilterSet {
//   // type: string;
//   filters: Filter[];
// }


// export interface Filter {
//   name: string;
//   value: string;
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
