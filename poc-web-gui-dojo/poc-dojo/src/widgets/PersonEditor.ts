import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import Button from '@dojo/widgets/button';
import TextInput from '@dojo/widgets/text-input';



export interface PersonProperties {
    personId: string;
}


export default class PersonEditor extends WidgetBase {

    private _onSubmit(event: Event) {
        event.preventDefault();
        // ... to be continued

        // Save person
    }

    protected render() {
        return v('div', {}, [
            v('form', {
                onsubmit: this._onSubmit
            }, [
                v('fieldset', {}, [
                    w(TextInput, {
                        key: 'firstName',
                        label: 'First name',
                        placeholder: 'First name',
                        type: 'text',
                        required: true
                        // onInput: this._onEmailInput
                    }),
                    w(TextInput, {
                        key: 'lastName',
                        label: 'Last name',
                        placeholder: 'Last name',
                        type: 'text',
                        required: true
                        // onInput: this._onPasswordInput
                    }),
                    w(Button, {}, ['Save'])
                ]),
            ])
        ]);
    }
}
