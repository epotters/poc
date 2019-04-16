import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';

import PeopleList from './PeopleList'

import * as css from './styles/People.m.css';

export default class People extends WidgetBase {
  protected render() {
    return [v('h1', {classes: [css.root]}, ['People Page']),
      w(PeopleList, {})
    ];
  }
}
