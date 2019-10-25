import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import {v} from "@dojo/framework/widget-core/d";

import {Message} from "../interfaces";
interface FeedbackProperties {
  message: Message;
}

export class Feedback extends WidgetBase<FeedbackProperties> {
  protected render() {
    const {message} = this.properties;
    return v('div', {classes: 'alert alert-info', role: 'alert'}, [
      v('ul', {classes: 'feedback-message'}, [message.text])
    ]);
  }
}
