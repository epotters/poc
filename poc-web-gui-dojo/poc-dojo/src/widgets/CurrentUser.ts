import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';

import {Errors, User, Session} from '../interfaces';
import {ErrorList} from './ErrorList';

import {dateFormatOptions, locale} from '../../config';
import {RouteIdPayload} from "../processes/interfaces";


export interface CurrentUserProperties {
  user: User,
  session: Session;
  errors: Errors;
  onLogout: (opts: object) => void;
  onRefreshToken: (opts: RouteIdPayload) => void;
}


export default class CurrentUser extends WidgetBase<CurrentUserProperties> {

  protected render() {
    const {user, session, errors} = this.properties;


    return [
      v('div', {classes: ['container', 'page']}, [
        v('h1', {}, ['Current user']),

        errors ? w(ErrorList, {errors}) : null,

        // Current user
        v('div', {classes: ['card', 'row', 'bg-light']}, [
          v('div', {classes: ['card-body']}, [

            v('form', {classes: 'form-horizontal'}, [

              CurrentUser.createFormGroup('Naam', user.displayName),
              CurrentUser.createFormGroup('Rollen', user.roles ? user.roles.join(', ') : ''),
              CurrentUser.createFormGroup('E-mail', user.mail),

              CurrentUser.createFormGroup('Session start', session.startTime.toLocaleString(locale, dateFormatOptions)),
              CurrentUser.createFormGroup('Session end', session.endTime.toLocaleString(locale, dateFormatOptions)),


              v('div', {classes: 'btn-toolbar', role: 'toolbar'}, [
                v('div', {classes: 'ml-auto'}, [
                  v('button', {
                    classes: ['btn', 'btn-outline-primary'],
                    onclick: this._onRefreshToken,
                  }, ['Refresh token']),

                  v('button', {
                    classes: ['btn', 'btn-primary'],
                    onclick: this._onLogout,
                  }, ['Sign out'])
                ])
              ])
            ])
          ])
        ])
      ])
    ];
  }


  private static createFormGroup(label: string, value: string) {
    return v('div', {classes: ['form-group', 'row']}, [
      v('label', {classes: ['control-label', 'col-sm-4']}, [label]),
      v('div', {classes: ['col-sm-8']}, [
        v('div', {classes: ['form-control']}, [value])
      ])
    ])
  }

  private _onLogout() {
    this.properties.onLogout({});
  }

  private _onRefreshToken() {
    this.properties.onRefreshToken({routeId: 'home'});
  }
};
