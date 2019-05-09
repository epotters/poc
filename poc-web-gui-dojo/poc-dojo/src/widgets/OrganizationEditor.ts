import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';

import Button from '@dojo/widgets/button';
import TextInput from '@dojo/widgets/text-input';
import {theme, ThemedMixin} from '@dojo/framework/widget-core/mixins/Themed';
import * as css from './styles/OrganizationEditor.m.css';

import {Organization} from '../interfaces';
import {OrganizationIdPayload, PartialOrganizationPayload} from '../processes/interfaces';


export interface OrganizationEditorProperties {
  organizationId: number;
  organization: Organization;
  loaded: boolean;
  isAuthenticated: boolean;
  loggedInUser: string;
  getOrganization: (opts: OrganizationIdPayload) => void;
  saveOrganization: (opts: PartialOrganizationPayload) => void;
  deleteOrganization: (opts: OrganizationIdPayload) => void;
  onFormInput: (opts: Partial<Organization>) => void;
  onFormSave: () => void;
}


@theme(css)
export default class OrganizationEditor extends ThemedMixin(WidgetBase)<OrganizationEditorProperties> {

  protected onNameInput(name: string) {
    this.properties.onFormInput({name});
  }

  protected render() {

    const {
      organization
    } = this.properties;


    return v('div', {classes: 'card'}, [

      v('form', {
        classes: this.theme(css.organizationEditor),
        onsubmit: this._onSubmit
      }, [

        w(TextInput, {
          key: 'idInput',
          label: 'id',
          // type: 'hidden',
          labelHidden: true,
          placeholder: '',
          value: ("" + organization.id),
          required: true
        }),

        w(TextInput, {
          key: 'nameInput',
          label: 'Name',
          labelHidden: false,
          placeholder: 'Name',
          value: organization.name,
          required: true,
          onInput: this.onNameInput
        }),

        v('div', {classes: this.theme(css.editorToolbar)}, [
          w(Button, {}, ['Cancel']),
          w(Button, {}, ['Delete']),
          w(Button, {}, ['Save'])
        ])
      ])
    ]);
  }

  private _onSubmit(event: Event) {
    event.preventDefault();
    this.properties.onFormSave();
  }
}
