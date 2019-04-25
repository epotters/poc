import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import Button from '@dojo/widgets/button';
import TextInput from '@dojo/widgets/text-input';
import {theme, ThemedMixin} from '@dojo/framework/widget-core/mixins/Themed';
import * as css from './styles/PersonEditor.m.css';
import {Person, ResourceBased} from '../interfaces';
import {PartialPersonPayload, PersonIdPayload} from '../processes/interfaces';


export interface PersonEditorProperties {
  personId: number;
  person: Partial<Person>;
  loaded: boolean;
  isAuthenticated: boolean;
  loggedInUser: string;
  getPerson: (opts: PersonIdPayload) => void;
  savePerson: (opts: PartialPersonPayload) => void;
  deletePerson: (opts: PersonIdPayload) => void;
  onFormInput: (opts: Partial<Person>) => void;
  onFormSave: () => void;
}


@theme(css)
export default class PersonEditor extends ThemedMixin(WidgetBase)<PersonEditorProperties> implements ResourceBased {

  loading: boolean;
  loaded: boolean;

  protected onFirstNameInput(firstName: string) {
    this.properties.onFormInput({firstName});
  }

  protected onPrefixInput(prefix: string) {
    this.properties.onFormInput({prefix});
  }

  protected onLastNameInput(lastName: string) {
    this.properties.onFormInput({lastName});
  }

  protected onGenderInput(gender: string) {
    this.properties.onFormInput({gender});
  }

  protected onBirthDateInput(birthDate: string) {
    this.properties.onFormInput({birthDate});
  }

  protected onBirthPlaceInput(birthPlace: string) {
    this.properties.onFormInput({birthPlace});
  }

  protected render() {


    const {
      personId,
      person,
        getPerson
    } = this.properties;


    getPerson({personId: personId});




    return v('form', {
      classes: this.theme(css.personEditor),
      onsubmit: this._onSubmit
    }, [

      w(TextInput, {
        key: 'idInput',
        label: 'id',
        // type: 'hidden',
        labelHidden: true,
        placeholder: '',
        value: ("" + personId),
        required: true
      }),

      v('fieldset', {classes: this.theme(css.field)}, [
        v('legend', {classes: this.theme(css.label)}, ['Name']),
        w(TextInput, {
          key: 'firstNameInput',
          label: 'First Name',
          labelHidden: true,
          placeholder: 'Given name',
          value: person.firstName,
          required: true,
          onInput: this.onFirstNameInput
        }),

        w(TextInput, {
          key: 'prefixInput',
          label: 'prefix',
          labelHidden: true,
          placeholder: 'Prefix',
          value: person.prefix,
          required: false,
          onInput: this.onPrefixInput
        }),
        w(TextInput, {
          key: 'lastNameInput',
          label: 'Last Name',
          labelHidden: true,
          placeholder: 'Surname name',
          value: person.lastName,
          required: true,
          onInput: this.onLastNameInput
        })
      ]),
      w(TextInput, {
        key: 'genderInput',
        label: 'Gender',
        labelHidden: false,
        placeholder: 'M/F',
        value: person.gender,
        required: false,
        onInput: this.onGenderInput
      }),
      // w(DatePicker, {
      w(TextInput, {
        key: 'birthDateInput',
        label: 'Birth date',
        labelHidden: false,
        placeholder: 'Date of birth',
        value: person.birthDate,
        required: false,
        onInput: this.onBirthDateInput
      }),
      w(TextInput, {
        key: 'birthPlaceInput',
        label: 'Birth place',
        value: person.birthPlace,
        required: false,
        onInput: this.onBirthPlaceInput
      }),
      v('div', {classes: this.theme(css.editorToolbar)}, [
        w(Button, {}, ['Cancel']),
        w(Button, {}, ['Save'])
      ])
    ]);
  }

  private _onSubmit(event: Event) {
    event.preventDefault();
    this.properties.onFormSave();
  }
}
