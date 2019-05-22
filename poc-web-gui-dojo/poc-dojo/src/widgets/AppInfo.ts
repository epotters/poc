import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import {v} from "@dojo/framework/widget-core/d";
import {applicationDisplayName} from '../../config';

import * as css from './styles/AppInfo.m.css';

export default class AppInfo extends WidgetBase {
  protected render() {
    return v('div', {classes: [css.root]}, [applicationDisplayName]);
  }
}
