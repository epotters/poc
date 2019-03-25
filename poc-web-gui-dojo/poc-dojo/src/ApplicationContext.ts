import { deepAssign } from '@dojo/framework/core/util';

import { PersonEditorProperties } from './widgets/PersonEditor';
import { PersonData } from './widgets/PersonEditor';

export default class ApplicationContext {

  private _workerData: PersonEditorProperties[];

  private _formData: Partial<PersonData> = {};

  private _invalidator: () => void;

  constructor(invalidator: () => void, workerData: PersonEditorProperties[] = []) {
    this._workerData = workerData;
    this._invalidator = invalidator;
  }

  get workerData(): PersonEditorProperties[] {
    return this._workerData;
  }

  get formData(): Partial<PersonData> {
    return this._formData;
  }

  public formInput(input: Partial<PersonData>): void {
    this._formData = deepAssign({}, this._formData, input);
    this._invalidator();
  }

  public submitForm(): void {
    this._workerData = [ ...this._workerData, this._formData ];
    this._formData = {};
    this._invalidator();
  }
}