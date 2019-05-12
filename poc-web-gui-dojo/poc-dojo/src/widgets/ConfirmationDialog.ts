import {WidgetBase} from '@dojo/framework/widget-core/WidgetBase';
import {v} from '@dojo/framework/widget-core/d';
import {Message} from '../interfaces';

interface ConfirmationDialogProperties {
  message: Message;
  visible: boolean;
}

export class ConfirmationDialog extends WidgetBase<ConfirmationDialogProperties> {

  protected render() {

    const {message, visible} = this.properties;

    return v('div', {classes: ['modal', 'fade', (visible ? 'show' : '')], style: 'display: ' + (visible ? 'block' : 'none'), role: 'dialog', tabindex: -1}, [
      v('div', {classes: ['modal-dialog'], role: 'document'}, [
        v('div', {classes: ['modal-content']}, [
          v('div', {classes: ['modal-header']}, [
            v('h5', {classes: ['modal-title']}, ['Confirmation']),
            v('button', {type: 'button', classes: ['close'], 'data-dismiss': 'modal', 'aria-label': 'Close'}, [
              v('span', {'aria-hidden': true}, ['x'])
            ])
          ]),
          v('div', {classes: ['modal-body']}, [
            v('p', {}, [message.text]),
          ]),
          v('div', {classes: ['modal-footer']}, [
            v('button', {type: 'button', classes: ['btn', 'btn-secondary'], 'data-dismiss': "modal"}, ['No']),
            v('button', {type: 'button', classes: ['btn', 'btn-primary']}, ['Yes'])
          ])
        ])
      ])
    ]);
  }
}

