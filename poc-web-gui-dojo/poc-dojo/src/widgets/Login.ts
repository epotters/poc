import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import Button from '@dojo/widgets/button';
import TextInput from '@dojo/widgets/text-input';

import * as css from './styles/Login.m.css';


export default class Login extends WidgetBase {

    private _onSubmit(event: Event) {
        event.preventDefault();
        // ... to be continued
    }

    private _onEmailInput(email: string) {
        // ... to be continued
    }

    private _onPasswordInput(password: string) {
        // ... to be continued
    }

    protected render() {
        return v('div', { classes: css.root }, [
            v('form', {
                onsubmit: this._onSubmit
            }, [
                v('fieldset', { }, [
                    w(TextInput, {
                        key: 'email',
                        label: 'Email',
                        placeholder: 'Email',
                        type: 'email',
                        required: true,
                        onInput: this._onEmailInput
                    }),
                    w(TextInput, {
                        key: 'password',
                        label: 'Password',
                        placeholder: 'Password',
                        type: 'password',
                        required: true,
                        onInput: this._onPasswordInput
                    }),
                    w(Button, { }, [ 'Login' ])
                ]),
            ])
        ]);
    }
}
