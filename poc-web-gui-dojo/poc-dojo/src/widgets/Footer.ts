import {ConfirmationRequest, Message} from "../interfaces";
import {WidgetBase} from "@dojo/framework/widget-core/WidgetBase";
import {v, w} from "@dojo/framework/widget-core/d";
import {Feedback} from "./Feedback";
import ConfirmationDialogContainer from "../containers/ConfirmationDialogContainer";


export interface FooterProperties {
  feedback?: Message;
  confirmationRequest?: ConfirmationRequest;
}


export class Footer extends WidgetBase<FooterProperties> {
  protected render() {

    const {confirmationRequest, feedback} = this.properties;

    return v('div', {classes: ['container', 'text-muted']}, [
      feedback ?
        w(Feedback, {message: feedback}) : '',
      confirmationRequest ?
        w(ConfirmationDialogContainer, {
          confirmationRequest: confirmationRequest,
          visible: true
        }) : ''
    ]);
  }
}
