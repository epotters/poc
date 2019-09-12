export interface ColumnConfig {
  label: string;
  helpText?: string;
  renderer?: (entity: any, value: string) => string;
  editor?: FieldEditorConfig;
}

export interface FieldEditorConfig {
  type: 'none' | 'text' | 'select' | 'date' | 'autocomplete';
  options?: SelectOption[];
  relatedEntity?: RelatedEntity;
}

export interface RelatedEntity {
  name: string;
  serviceName: string;
  displayField: string;

  displayOption?(entity?: any): string | undefined;
}

export class FilterConfig {
  type: 'none' | 'text' | 'select' | 'date' = "none";
  options?: SelectOption[];
}

export interface SelectOption {
  label: string,
  value: string
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

  displayedColumns: string[];
  filteredColumns: Record<string, FilterConfig>;

  columnConfigs: Record<string, ColumnConfig>;

  relatedEntities?: string[];

  // Form
  validationMessages?: any;

}
