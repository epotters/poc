import {OutletContext} from "@dojo/framework/routing/interfaces";
import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import ThemedMixin, {theme} from "@dojo/framework/widget-core/mixins/Themed";
import {v, w} from "@dojo/framework/widget-core/d";

import * as css from './styles/PersonEditor.m.css';
import {Errors, Person, WithTarget} from '../interfaces';
import {ChangeRoutePayload, ConfirmationPayload, PartialPersonPayload, PersonIdPayload} from '../processes/interfaces';
import {ErrorList} from "./ErrorList";

export interface PersonEditorProperties {

  person: Partial<Person>;

  canNavigate: boolean;
  previousPerson: Person;
  nextPerson: Person;
  hasPrevious: boolean;
  hasNext: boolean;

  loaded: boolean;
  isNew: boolean;
  hasChanges: boolean;
  errors: Errors;

  getPerson: (opts: PersonIdPayload) => void;
  savePerson: (opts: PartialPersonPayload) => void;
  deletePerson: (opts: ConfirmationPayload) => void;
  cancelPersonAction: (opts: Object) => void;
  editorInput: (opts: PartialPersonPayload) => void;
  clearEditor: (opts: Object) => void;

  changeRoute: (opts: ChangeRoutePayload) => void;
}


@theme(css)
export default class PersonEditor extends ThemedMixin(WidgetBase)<PersonEditorProperties> {

  protected render() {

    const {
      person,
      isNew,
      hasChanges,
      canNavigate,
      hasPrevious,
      hasNext,
      errors
    } = this.properties;


    return v('div', {classes: ['container', 'page']}, [
      v('h1', {}, [isNew ? 'New Person' : 'Edit person']),

      errors ? w(ErrorList, {key: 'person-editor-errors', errors}) : '',

      v('div', {classes: ['card', 'row', 'bg-light']}, [
        v('div', {classes: ['card-body']}, [

          v('form', {
            classes: ['form-horizontal'],
            onsubmit: this._onSubmit
          }, [

            v('div', {classes: ['form-group', 'form-row']}, [
              v('label', {classes: ['control-label', 'col-sm-4']}, ['ID']),
              v('div', {classes: ['col-sm-2']}, [
                v('input', {
                  classes: ['form-control'],
                  key: 'idInput',
                  readOnly: true,
                  placeholder: 'ID',
                  value: (person && person.id) ? this.toString(person.id) : '',
                  required: true
                })
              ])
            ]),


            v('div', {classes: ['form-group', 'form-row']}, [

              v('label', {classes: ['control-label', 'col-sm-4']}, ['Name']),
              v('div', {classes: ['col-sm-8']}, [
                v('div', {classes: ['form-row']}, [
                  v('div', {classes: ['col-md-4']}, [
                    v('input', {
                      classes: ['form-control'],
                      key: 'firstNameInput',
                      name: 'firstName',
                      label: 'First Name',
                      labelHidden: true,
                      placeholder: 'Given name',
                      value: person.firstName,
                      required: true,
                      oninput: this._onInput
                    })
                  ]),
                  v('div', {classes: ['col-md-2']}, [
                    v('input', {
                      classes: ['form-control'],
                      key: 'prefixInput',
                      name: 'prefix',
                      label: 'Prefix',
                      labelHidden: true,
                      // placeholder: 'Prefix, e.g. van der',
                      value: person.prefix,
                      required: false,
                      oninput: this._onInput
                    })
                  ]),
                  v('div', {classes: ['col-md-6']}, [
                    v('input', {
                      classes: ['form-control'],
                      key: 'lastNameInput',
                      name: 'lastName',
                      label: 'Last Name',
                      labelHidden: true,
                      placeholder: 'Family name',
                      value: person.lastName,
                      required: true,
                      oninput: this._onInput
                    })
                  ])
                ])
              ])
            ]),

            v('div', {classes: ['form-group', 'form-row']}, [
              v('label', {classes: ['control-label', 'col-sm-4']}, ['Gender']),
              v('div', {classes: ['col-sm-8']}, [
                v('div', {classes: ['form-check', 'form-check-inline']}, [
                  v('input', {
                    key: 'genderInput',
                    name: 'gender',
                    id: 'genderInputMale',
                    type: 'radio',
                    value: 'MALE',
                    checked: (person.gender == 'MALE'),
                    oninput: this._onInput,
                    classes: ['form-check-input']
                  }),
                  v('label', {classes: ['form-check-label'], for: 'genderInputMale'}, ['Man'])
                ]),
                v('div', {classes: ['form-check', 'form-check-inline']}, [
                  v('input', {
                    key: 'genderInput',
                    name: 'gender',
                    id: 'genderInputFemale',
                    type: 'radio',
                    value: 'FEMALE',
                    checked: (person.gender == 'FEMALE'),
                    oninput: this._onInput,
                    classes: ['form-check-input']
                  }),
                  v('label', {classes: ['form-check-label'], for: 'genderInputFemale'}, ['Woman'])
                ])
              ])
            ]),


            v('div', {classes: ['form-group', 'form-row']}, [
              v('label', {classes: ['control-label', 'col-sm-4']}, ['Date of birth']),
              v('div', {classes: ['col-sm-4']}, [
                v('input', {
                  key: 'birthDateInput',
                  type: 'date',
                  name: 'birthDate',
                  placeholder: 'Date of birth',
                  value: person.birthDate,
                  oninput: this._onInput,
                  classes: ['form-control']
                })
              ])
            ]),

            v('div', {classes: ['form-group', 'form-row']}, [
              v('label', {classes: ['control-label', 'col-sm-4']}, ['Place of birth']),
              v('div', {classes: ['col-sm-5']}, [
                v('input', {
                  key: 'birthPlaceInput',
                  name: 'birthPlace',
                  placeholder: 'Birth place',
                  value: person.birthPlace,
                  oninput: this._onInput,
                  classes: ['form-control']
                })
              ])
            ]),


            v('div', {classes: 'btn-toolbar', role: 'toolbar'}, [

              v('div', {classes: ['editor-buttons-left']}, [
                canNavigate ?
                  v('button', {
                    key: 'previous-button',
                    type: 'button',
                    disabled: !hasPrevious,
                    onclick: this._onPrevious,
                    classes: ['btn', 'btn-outline-primary']
                  }, [
                    v('i', {classes: ['fa', 'fa-angle-left']})
                  ]) : '',

                canNavigate ?
                  v('button', {
                    key: 'next-button',
                    type: 'button',
                    disabled: !hasNext,
                    onclick: this._onNext,
                    classes: ['btn', 'btn-outline-primary']
                  }, [
                    v('i', {classes: ['fa', 'fa-angle-right']})
                  ]) : ''
              ]),

              v('div', {classes: ['editor-buttons-right', 'ml-auto']}, [

                v('button', {
                  key: 'reset-button',
                  type: 'button',
                  disabled: !hasChanges,
                  onclick: this._onResetEditor,
                  classes: ['btn', 'btn-outline-primary']
                }, ['Reset']),

                isNew ? '' :
                  v('button', {
                    key: 'delete-button',
                    type: 'button',
                    onclick: this._onDeletePerson,
                    classes: ['btn', 'btn-outline-primary']
                  }, ['Delete']),

                v('button', {
                  key: 'save-button',
                  type: 'submit',
                  disabled: !hasChanges,
                  classes: ['btn', 'btn-primary']
                }, ['Save'])
              ])
            ])
          ])
        ])
      ])
    ]);
  }

  private _onInput({target: {name: fieldName, value: fieldValue}}: WithTarget) {
    this.properties.editorInput({person: {[fieldName]: fieldValue}});
  }


  private _onSubmit(event: Event) {
    event.preventDefault();

    const {person} = this.properties;

    console.log('Person about to save:');
    console.log(person);
    this.properties.savePerson({person: person})
  }

  private _onDeletePerson() {

    console.debug('Delete button on the editor clicked');

    const confirmationRequest = {
      action: 'delete-person',
      text: 'Are you sure you want to delete this person?',
      confirming: false,
      confirmed: false,
      confirm: this.properties.deletePerson,
      cancel: this.properties.cancelPersonAction
    };

    this.properties.deletePerson({confirmationRequest: confirmationRequest});
  }

  private _onResetEditor() {
    const {person, isNew} = this.properties;
    if (isNew) {
      this.properties.clearEditor({});
    } else {
      this.properties.getPerson({personId: (person && person.id) ? person.id : -1});
    }
  }

  private _onPrevious() {
    const {previousPerson} = this.properties;
    console.info('Go to the previous person with id ' + previousPerson.id);
    this.goToPerson(previousPerson.id);
  }

  private _onNext() {
    const {nextPerson} = this.properties;
    console.info('Go to the next person with id ' + nextPerson.id);
    this.goToPerson(nextPerson.id);
  }


  private goToPerson(personId: number) {
    const context: OutletContext = {
      id: 'person',
      type: 'index',
      params: {
        personId: this.toString(personId)
      },
      queryParams: {},
      isError: function () {
        return false;
      },
      isExact: function () {
        return true;
      }
    };
    this.properties.changeRoute({outlet: 'person', context: context});
  }


  private toString(number: number): string {
    return '' + number;
  }
}
