import {v} from "@dojo/framework/widget-core/d";
import WidgetBase from "@dojo/framework/widget-core/WidgetBase";

import {ConfirmationRequest} from '../interfaces';


export interface ConfirmationDialogProperties {
  visible: boolean;
  confirmationRequest: ConfirmationRequest
}

export class ConfirmationDialog extends WidgetBase<ConfirmationDialogProperties> {

  protected render() {

    const {visible, confirmationRequest} = this.properties;

    return [
      v('div', {
        classes: ['modal', 'fade', (visible ? 'show' : '')],
        style: 'display: ' + (visible ? 'block' : 'none'),
        role: 'dialog',
        tabindex: -1
      }, [
        v('div', {classes: ['modal-dialog'], role: 'document'}, [
          v('div', {classes: ['modal-content']}, [
            v('div', {classes: ['modal-header']}, [
              v('h5', {classes: ['modal-title']}, ['Confirmation']),
              v('button', {
                type: 'button',
                classes: ['close'],
                'data-dismiss': 'modal',
                'aria-label': 'Close',
                onclick: this.clickNo
              }, [
                v('span', {'aria-hidden': true}, ['x'])
              ])
            ]),
            v('div', {classes: ['modal-body']}, [
              v('p', {}, [confirmationRequest.text]),
            ]),
            v('div', {classes: ['modal-footer']}, [
              v('button', {
                type: 'button',
                classes: ['btn', 'btn-secondary'],
                'data-dismiss': 'modal',
                onclick: this.clickNo
              }, ['No']),
              v('button',
                {
                  type: 'button',
                  classes: ['btn', 'btn-primary'],
                  onclick: this.clickYes
                },
                ['Yes'])
            ])
          ])
        ])
      ]),
      v('div', {classes: ['modal-backdrop', 'fade', 'show']}, [])
    ];
  }

  private clickYes() {
    const {confirmationRequest} = this.properties;
    confirmationRequest.confirmed = true;
    confirmationRequest.confirm({confirmationRequest: confirmationRequest});
  }

  private clickNo() {
    const {confirmationRequest} = this.properties;
    confirmationRequest.cancel({confirmationRequest: confirmationRequest});
  }
}

