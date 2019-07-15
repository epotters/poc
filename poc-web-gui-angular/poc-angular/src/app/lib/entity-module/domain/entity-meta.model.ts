import {FilterConfig} from "../table-filter/components/filter-cell/filter-cell.component";

export interface ColumnConfig {
  label: string;
  helpText?: string;
  renderer?: (value: string) => string;
  editor?: FieldEditor;
}

export interface FieldEditor {
  type: 'text' | 'select' | 'date';
  options?: SelectOption[]
}

export interface SelectOption {
  value: string,
  label: string
}

export interface EntityMeta<T extends Identifiable> {

  // General
  name: string;
  namePlural: string;
  displayName: string;
  displayNamePlural: string;

  // API
  apiBase: string;

  // List
  defaultPageSize: number;
  defaultSortField: string;
  defaultSortDirection: 'asc' | 'desc';
  defaultFilterField: string;

  displayedColumns: string[];
  filteredColumns: Record<string, FilterConfig>;

  columnConfigs: Record<string, ColumnConfig>;

  // Form
  validationMessages?: any;
}
