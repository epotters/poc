export class EntityLibConfig {
  public static dateFormat: string = 'YYYY-MM-DD';
  public static autoSave: boolean = true;
  public static defaultSnackbarDuration: number = 3000;
  public static defaultDialogWidth: string = '600px';
}


export const ENTITY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};
