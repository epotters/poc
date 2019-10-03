import {FieldFilter} from "./filter.model";
import {SortDirectionType} from "./entity-meta.model";

export interface EntityListState {

  // Data
  fieldFilters: FieldFilter[];
  sortField: string;
  sortDirection: SortDirectionType;
  page: number;
  pageSize: number;


  // View
  filterRowVisible: boolean;
  editorRowVisible: boolean;
}
