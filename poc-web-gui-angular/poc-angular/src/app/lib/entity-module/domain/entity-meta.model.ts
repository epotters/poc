export interface ColumnConfig {
  label: string;
  helpText?: string;
  renderer?: (entity: any, value: string) => string;
  editor?: FieldEditorConfig;
  filter?: FieldEditorConfig;
  validators?: ValidatorDescriptor[]
}

export interface FieldEditorConfig {
  type: 'none' | 'text' | 'select' | 'date' | 'autocomplete';
  options?: SelectOption[];
  relatedEntity?: RelatedEntity;
}

export interface SelectOption {
  label: string,
  value: string
}

export interface RelatedEntity {
  name: string;
  serviceName: string;
  displayField: string;

  displayOption?(entity?: any): string | undefined;
}

export interface ValidatorDescriptor {
  type: 'required' | 'pattern' | 'maxLength',
  argument?: any,
  message: string
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
  displayedColumnsDialog?: string[];

  columnConfigs: Record<string, ColumnConfig>;
  relatedEntities?: string[];

}
