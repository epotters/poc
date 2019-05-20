import {WidgetBase} from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import {Errors, LoginRequest, WithTarget} from '../interfaces';
import {ErrorList} from './ErrorList';
import {PartialLoginRequestPayload, RouteIdPayload} from '../processes/interfaces';

export interface LoginProperties {

  loginRequest: LoginRequest;
  inProgress?: boolean;
  errors?: Errors;

  onLoginRequestInput: (opts: PartialLoginRequestPayload) => void;
  onLogin: (opts: RouteIdPayload) => void;
}

export class Login extends WidgetBase<LoginProperties> {

  // prettier-ignore
  protected render() {

    const {loginRequest, inProgress = false, errors} = this.properties;

    return v('div', {classes: ['container', 'page']}, [

      v('h1', {}, ['Sign In']),

      v('div', {classes: ['card', 'bg-light']}, [
        v('div', {classes: ['card-body']}, [

          errors ? w(ErrorList, {errors}) : null,

          v('form', {onsubmit: this._onLogin}, [

            v('div', {classes: ['form-group']}, [
              v('input', {
                classes: ['form-control'],
                name: 'username',
                type: 'username',
                placeholder: 'Username',
                oninput: this._onInput,
                value: loginRequest.username
              })
            ]),
            v('div', {classes: ['form-group']}, [
              v('input', {
                classes: ['form-control'],
                name: 'password',
                type: 'password',
                placeholder: 'Password',
                oninput: this._onInput,
                value: loginRequest.password
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


  private _onInput({target: {name: fieldName, value: fieldValue}}: WithTarget) {
    this.properties.onLoginRequestInput({loginRequest: {[fieldName]: fieldValue}});
  }

  private _onLogin(event: Event) {
    event.preventDefault();
    this.properties.onLogin({routeId: 'currentUser'});
  }
}
