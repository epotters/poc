import {WidgetBase} from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import {Errors, WithTarget} from '../interfaces';
import {ErrorList} from './ErrorList';
import {PasswordPayload, RouteIdPayload, UsernamePayload} from '../processes/interfaces';

export interface LoginProperties {
  username: string;
  password: string;

  inProgress?: boolean;
  errors: Errors;

  onUsernameInput: (opts: UsernamePayload) => void;
  onPasswordInput: (opts: PasswordPayload) => void;
  onLogin: (opts: RouteIdPayload) => void;
}

export class Login extends WidgetBase<LoginProperties> {

  // prettier-ignore
  protected render() {

    const {username, password, inProgress = false, errors} = this.properties;

    return v('div', {classes: ['container', 'page']}, [

      v('h1', {}, ['Sign In']),

      v('div', {classes: ['card', 'row', 'bg-light']}, [
        v('div', {classes: ['card-body']}, [
          errors ? w(ErrorList, {errors}) : null,

          v('form', {onsubmit: this._onLogin}, [

            v('div', {classes: ['form-group']}, [
              v('input', {
                classes: ['form-control'],
                type: 'username',
                placeholder: 'Username',
                oninput: this._onUsernameInput,
                value: username
              })
            ]),
            v('div', {classes: ['form-group']}, [
              v('input', {
                classes: ['form-control'],
                type: 'password',
                placeholder: 'Password',
                oninput: this._onPasswordInput,
                value: password
              })
            ]),

            v('div', {classes: 'btn-toolbar', role: 'toolbar'}, [
              v('button', {
                classes: ['btn', 'btn-primary', 'ml-auto'],
                disabled: inProgress,
                type: 'submit'
              }, ['Sign In'])
            ])
          ])
        ])
      ])
    ]);
  }

  private _onUsernameInput({target: {value: username}}: WithTarget) {
    console.log('Username input');
    console.log(arguments);
    this.properties.onUsernameInput({username});
  }

  private _onPasswordInput({target: {value: password}}: WithTarget) {
    this.properties.onPasswordInput({password});
  }

  private _onLogin(event: Event) {
    event.preventDefault();
    this.properties.onLogin({routeId: 'currentUser'});
  }
}
