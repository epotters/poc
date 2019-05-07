import {WidgetBase} from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import {Errors, WithTarget} from '../interfaces';
import {ErrorList} from './ErrorList';
import {PasswordPayload, UsernamePayload} from '../processes/interfaces';

export interface LoginProperties {
  username: string;
  password: string;

  inProgress?: boolean;
  errors: Errors;

  onUsernameInput: (opts: UsernamePayload) => void;
  onPasswordInput: (opts: PasswordPayload) => void;
  onLogin: (opts: object) => void;
}

export class Login extends WidgetBase<LoginProperties> {

  // prettier-ignore
  protected render() {

    const {username, password, inProgress = false, errors} = this.properties;

    return v('div', {classes: ['container', 'page']}, [
      v('h1', {classes: 'text-xs-center'}, ['Sign In']),

      v('div', {classes: ['panel', 'row']}, [
        v('div', {classes: ['col-md-6', 'offset-md-3', 'col-xs-12']}, [
          errors ? w(ErrorList, {errors}) : null,

          v('form', {onsubmit: this._onLogin}, [
            v('fieldset', [

              v('fieldset', {classes: 'form-group'}, [
                v('input', {
                  classes: ['form-control', 'form-control-lg'],
                  type: 'username',
                  placeholder: 'Username',
                  oninput: this._onUsernameInput,
                  value: username
                })
              ]),
              v('fieldset', {classes: 'form-group'}, [
                v('input', {
                  classes: ['form-control', 'form-control-lg'],
                  type: 'password',
                  placeholder: 'Password',
                  oninput: this._onPasswordInput,
                  value: password
                })
              ]),

              v('div', {classes: 'btn-toolbar', role: 'toolbar'}, [
                v('button', {
                  classes: ['btn btn-lg', 'btn-primary', 'pull-right'],
                  disabled: inProgress,
                  type: 'submit'
                }, ['Sign In'])
              ])
            ])
          ])
        ])
      ])
    ]);
  }

  private _onUsernameInput({target: {value: username}}: WithTarget) {
    this.properties.onUsernameInput({username});
  }

  private _onPasswordInput({target: {value: password}}: WithTarget) {
    this.properties.onPasswordInput({password});
  }

  private _onLogin(event: Event) {
    event.preventDefault();
    this.properties.onLogin({});
  }
}
