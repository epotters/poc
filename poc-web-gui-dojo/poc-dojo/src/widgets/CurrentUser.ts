import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';

import {Errors, UserSession} from '../interfaces';
import {ErrorList} from './ErrorList';

import {locale} from '../../config';


export interface CurrentUserProperties {
  user: UserSession,
  inProgress?: boolean;
  errors: Errors;
  onLogout: (opts: object) => void;
}


export default class CurrentUser extends WidgetBase<CurrentUserProperties> {

  loading: boolean;

  protected render() {
    const {user, inProgress = false, errors} = this.properties;


    let rolesDisplay: string = '';
    for (let idx in user.roles) {
      rolesDisplay += user.roles[idx] + ', ';
    }
    rolesDisplay = rolesDisplay.substring(0, rolesDisplay.length - 2);


    return [
      v('div', {classes: ['container', 'page']}, [
        v('h1', {}, ['Huidige gebruiker']),

        errors ? w(ErrorList, {errors}) : null,

        // Current user
        v('div', {classes: 'panel'}, [
          v('form', {classes: 'form-horizontal'}, [
            CurrentUser.createFormGroup('Naam', user.displayName),
            CurrentUser.createFormGroup('Rollen', user.roles ? user.roles.join(', ') : ''),
            CurrentUser.createFormGroup('E-mail', user.mail),
            CurrentUser.createFormGroup('Session start', user.startTime.toLocaleString(locale)),
            CurrentUser.createFormGroup('Session end', user.endTime.toLocaleString(locale)),


            v('div', {classes: 'btn-toolbar', role: 'toolbar'}, [
              v('button', {
                classes: ['btn btn-lg', 'btn-primary', 'pull-right'],
                disabled: inProgress,
                onclick: this._onLogout,
              }, ['Sign out'])
            ])
          ])
        ])
      ])
    ];
  }


  private static createFormGroup(label: string, value: string) {
    return v('div', {classes: ['form-group']}, [
      v('label', {classes: ['col-sm-4', 'control-label']}, [label]),
      v('div', {classes: ['col-sm-8']}, [
        v('div', {classes: ['form-control']}, [value])
      ])
    ])
  }

  private _onLogout() {
    this.properties.onLogout({});
  }
};
