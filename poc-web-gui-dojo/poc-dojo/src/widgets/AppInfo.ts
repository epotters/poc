import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v} from '@dojo/framework/widget-core/d';

import * as css from './styles/AppInfo.m.css';

export default class AppInfo extends WidgetBase {
  appDisplayName: 'Proof of Concept!';

  protected render() {
    return v('div', {classes: [css.root]}, [this.appDisplayName]);
  }
}
