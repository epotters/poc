import {FieldFilter} from "./filter.model";

export interface EntityListState {

  // Data
  fieldFilters: FieldFilter[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
  page: number;
  pageSize: number;


  // View
  filterRowVisible: boolean;
  editorRowVisible: boolean;
}
