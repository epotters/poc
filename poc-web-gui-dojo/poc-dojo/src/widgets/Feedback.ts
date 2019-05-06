import {WidgetBase} from '@dojo/framework/widget-core/WidgetBase';
import {v} from '@dojo/framework/widget-core/d';


interface FeedbackProperties {
  message: string;
}

export class Feedback extends WidgetBase<FeedbackProperties> {
  protected render() {
    const {message} = this.properties;
    return v('div', {classes: 'alert alert-info', role: 'alert'}, [
      v('ul', {classes: 'feedback-message'}, [message])
    ]);
  }
}
