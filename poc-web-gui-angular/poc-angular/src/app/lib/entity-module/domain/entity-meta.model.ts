import {Identifiable} from "./identifiable.model";

export declare type EditorType = 'none' | 'text' | 'textarea' | 'select' | 'date' | 'entity-selector' | 'relation';
export declare type SortDirectionType = 'asc' | 'desc';

export interface ColumnConfig {
  label: string;
  helpText?: string;
  renderer?: (entity: any, value: string) => string;
  editor?: FieldEditorConfig;
  rowEditor?: FieldEditorConfig;
  filter?: FieldEditorConfig;
  validators?: ValidatorDescriptor[]
}

export interface FieldEditorConfig {
  type: EditorType;
  options?: SelectOption[];
  relatedEntity?: RelatedEntity;
  relationEntity?: RelationEntity;
}

export interface SelectOption {
  label: string,
  value: string
}

export interface RelatedEntity {
  name: string;
  namePlural: string;
  serviceName: string;
  displayField: string;
  displayOption?(entity?: any): string | null;
}

export interface RelationEntity {
  relationClass: string;
  owner: string;
  columns: string[];
  sort?: string;
  sortDirection?: SortDirectionType;
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

  displayNameRenderer: (entity: T) => string;

  // API
  apiBase: string;

  // List
  defaultPageSize: number;
  defaultSortField: string;
  defaultSortDirection: SortDirectionType;

  displayedColumns: string[];
  displayedColumnsDialog?: string[];

  columnConfigs: Record<string, ColumnConfig>;
}
