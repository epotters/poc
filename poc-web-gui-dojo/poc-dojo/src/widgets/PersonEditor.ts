import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import {theme, ThemedMixin} from '@dojo/framework/widget-core/mixins/Themed';
import * as css from './styles/PersonEditor.m.css';
import {ConfirmationRequest, Errors, Person, WithTarget} from '../interfaces';
import {ConfirmedPersonActionPayload, PartialPersonPayload, PersonIdPayload} from '../processes/interfaces';
import {ErrorList} from "./ErrorList";
import {ConfirmationDialog} from "./ConfirmationDialog";


export interface PersonEditorProperties {
  personId: number;
  person: Person;

  loaded: boolean;
  confirmationRequest: ConfirmationRequest;

  errors: Errors;

  getPerson: (opts: PersonIdPayload) => void;
  savePerson: (opts: PartialPersonPayload) => void;
  deletePerson: (opts: ConfirmedPersonActionPayload) => void;
  cancelDeletePerson: (opts: Object) => void;

  clearEditor: (opts: Object) => void;
  editorInput: (opts: PartialPersonPayload) => void;
}


@theme(css)
export default class PersonEditor extends ThemedMixin(WidgetBase)<PersonEditorProperties> {


  protected render() {

    const {
      personId,
      person,
      confirmationRequest,
      errors
    } = this.properties;


    return v('div', {classes: ['container', 'page']}, [
      v('h1', {}, ['Person Editor']),

      errors ? w(ErrorList, {errors}) : null,

      !!confirmationRequest ?
        w(ConfirmationDialog, {
          message: {text: 'Are you sure...?'},
          // visible: (confirmationRequest && confirmationRequest.confirming)
          visible: true
        }) : '',


      v('div', {classes: ['card', 'row', 'bg-light']}, [
        v('div', {classes: ['card-body']}, [

          v('form', {
            classes: ['form-horizontal'],
            onsubmit: this._onSubmit

          }, [

            v('div', {classes: ['form-group', 'form-row']}, [
              v('label', {classes: ['control-label', 'col-sm-4']}, ['ID']),
              v('div', {classes: ['col-sm-8']}, [
                v('input', {
                  classes: ['form-control'],
                  key: 'idInput',
                  readOnly: true,
                  placeholder: 'ID',
                  value: this.toString(personId),
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
                      label: 'First Name',
                      labelHidden: true,
                      placeholder: 'Given name',
                      value: person.firstName,
                      required: true,
                      oninput: this.onFirstNameInput
                    })
                  ]),
                  v('div', {classes: ['col-md-2']}, [
                    v('input', {
                      classes: ['form-control'],
                      key: 'prefixInput',
                      label: 'Prefix',
                      labelHidden: true,
                      // placeholder: 'Prefix, e.g. van der',
                      value: person.prefix,
                      required: false,
                      oninput: this.onPrefixInput
                    })
                  ]),
                  v('div', {classes: ['col-md-6']}, [
                    v('input', {
                      classes: ['form-control'],
                      key: 'lastNameInput',
                      label: 'Last Name',
                      labelHidden: true,
                      placeholder: 'Family name',
                      value: person.lastName,
                      required: true,
                      oninput: this.onLastNameInput
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
                    classes: ['form-check-input'],
                    key: 'genderInput',
                    name: 'genderInput',
                    id: 'genderInputMale',
                    type: 'radio',
                    value: 'MALE',
                    checked: (person.gender == 'MALE'),
                    oninput: this.onGenderInput
                  }),
                  v('label', {classes: ['form-check-label'], for: 'genderInputMale'}, ['Man'])
                ]),
                v('div', {classes: ['form-check', 'form-check-inline']}, [
                  v('input', {
                    classes: ['form-check-input'],
                    key: 'genderInput',
                    name: 'genderInput',
                    id: 'genderInputFemale',
                    type: 'radio',
                    value: 'FEMALE',
                    checked: (person.gender == 'FEMALE'),
                    oninput: this.onGenderInput
                  }),
                  v('label', {classes: ['form-check-label'], for: 'genderInputFemale'}, ['Woman'])
                ])
              ])
            ]),


            v('div', {classes: ['form-group', 'form-row']}, [
              v('label', {classes: ['control-label', 'col-sm-4']}, ['Date of birth']),
              v('div', {classes: ['col-sm-8']}, [
                v('input', {
                  classes: ['form-control'],
                  key: 'birthDateInput',
                  placeholder: 'Date of birth',
                  value: person.birthDate,
                  oninput: this.onBirthDateInput
                })
              ])
            ]),

            v('div', {classes: ['form-group', 'form-row']}, [
              v('label', {classes: ['control-label', 'col-sm-4']}, ['Place of birth']),
              v('div', {classes: ['col-sm-8']}, [
                v('input', {
                  classes: ['form-control'],
                  key: 'birthPlaceInput',
                  placeholder: 'Birth place',
                  value: person.birthPlace,
                  oninput: this.onBirthPlaceInput
                })
              ])
            ]),


            v('div', {classes: 'btn-toolbar', role: 'toolbar'}, [

              v('div', {classes: 'ml-auto'}, [

                v('button', {
                  type: 'button',
                  classes: ['btn', 'btn-outline-primary'],
                  onclick: this._onResetEditor,
                }, ['Reset']),

                v('button', {
                  type: 'button',
                  classes: ['btn', 'btn-outline-primary'],
                  onclick: this._onDeletePerson,
                }, ['Delete']),

                v('button', {
                  classes: ['btn', 'btn-primary'],
                  type: 'submit'
                }, ['Save'])
              ])
            ])
          ])
        ])
      ])
    ]);
  }


  // Field input handlers
  protected onFirstNameInput({target: {value: firstName}}: WithTarget) {
    console.log('Arguments on the next line:');
    console.log(arguments);
    this.properties.editorInput({person: {firstName: firstName}});
  }

  protected onPrefixInput({target: {value: prefix}}: WithTarget) {
    this.properties.editorInput({person: {prefix: prefix}});
  }

  protected onLastNameInput({target: {value: lastName}}: WithTarget) {
    this.properties.editorInput({person: {lastName: lastName}});
  }

  protected onGenderInput({target: {value: gender}}: WithTarget) {
    this.properties.editorInput({person: {gender: gender}});
  }

  protected onBirthDateInput({target: {value: birthDate}}: WithTarget) {
    this.properties.editorInput({person: {birthDate: birthDate}});
  }

  private onBirthPlaceInput({target: {value: birthPlace}}: WithTarget) {
    this.properties.editorInput({person: {birthPlace: birthPlace}});
  }


  private _onSubmit(event: Event) {
    event.preventDefault();

    const {
      person
    } = this.properties;

    console.log('Person about to save:');
    console.log(person);
    this.properties.savePerson({person: person})
  }

  private _onDeletePerson() {
    const {
      personId
    } = this.properties;

    const confirmationRequest = {
      action: 'delete-person',
      confirming: false,
      confirmed: false,
      confirm: this.properties.deletePerson,
      cancel: this.properties.cancelDeletePerson
    };

    this.properties.deletePerson({personId: personId, confirmationRequest: confirmationRequest, options: {}});
  }

  private _onResetEditor() {
    this.properties.clearEditor({});
  }


  private toString(number: number): string {
    return '' + number;
  }
}
