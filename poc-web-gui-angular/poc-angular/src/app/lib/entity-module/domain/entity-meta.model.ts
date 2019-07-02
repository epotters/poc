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
  defaultSortDirection: string; // 'asc' | 'desc';
  displayedColumns: string[];



  // Form
  validationMessages?: any;
}
