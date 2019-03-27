import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import Button from '@dojo/widgets/button';
import TextInput from '@dojo/widgets/text-input';
// import ApplicationContext from './ApplicationContext';

import {theme, ThemedMixin} from '@dojo/framework/widget-core/mixins/Themed';
import * as css from './styles/PersonEditor.m.css';




export interface PersonData {
    id: string;
    firstName: string;
    prefix: string;
    lastName: string;
    gender: string;
    birthDate: string;
    birthPlace: string;
}


export interface PersonEditorProperties {
    personId: string;
    personData: Partial<PersonData>;
    onFormInput: (data: Partial<PersonData>) => void;
    onFormSave: () => void;
}


@theme(css)
export default class PersonEditor extends ThemedMixin(WidgetBase)<PersonEditorProperties> {


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

    private _onSubmit(event: Event) {
        event.preventDefault();

        this.properties.onFormSave();
    }

    protected render() {

        const {
            personData: {firstName, prefix, lastName, gender, birthDate, birthPlace}
        } = this.properties;


        return v('form', {
            classes: this.theme(css.personEditor),
            onsubmit: this._onSubmit
        }, [
            v('fieldset', {classes: this.theme(css.field)}, [
                v('legend', {classes: this.theme(css.label)}, ['Name']),
                w(TextInput, {
                    key: 'firstNameInput',
                    label: 'First Name',
                    labelHidden: true,
                    placeholder: 'Given name',
                    value: firstName,
                    required: true,
                    onInput: this.onFirstNameInput
                }),
                w(TextInput, {
                    key: 'prefixInput',
                    label: 'prefix',
                    labelHidden: true,
                    placeholder: 'Prefix',
                    value: prefix,
                    required: false,
                    onInput: this.onPrefixInput
                }),
                w(TextInput, {
                    key: 'lastNameInput',
                    label: 'Last Name',
                    labelHidden: true,
                    placeholder: 'Surname name',
                    value: lastName,
                    required: true,
                    onInput: this.onLastNameInput
                })
            ]),
            w(TextInput, {
                key: 'genderInput',
                label: 'Gender',
                labelHidden: false,
                placeholder: 'M/F',
                value: gender,
                required: false,
                onInput: this.onGenderInput
            }),
            // w(DatePicker, {
            w(TextInput, {
                key: 'birthDateInput',
                label: 'Birth date',
                labelHidden: false,
                placeholder: 'Date of birth',
                value: birthDate,
                required: false,
                onInput: this.onBirthDateInput
            }),
            w(TextInput, {
                key: 'birthPlaceInput',
                label: 'Birth place',
                value: birthPlace,
                required: false,
                onInput: this.onBirthPlaceInput
            }),
            v('div', {classes: this.theme(css.editorToolbar)}, [
                w(Button, {}, ['Cancel']),
                w(Button, {}, ['Save'])
            ])
        ]);
    }
}
