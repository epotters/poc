import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v} from '@dojo/framework/widget-core/d';
import {ThemedMixin} from "@dojo/framework/widget-core/mixins/Themed";

import * as css from './styles/PageBody.m.css';


export interface PageBodyProperties {
  pageTitle: string;

  authenticationRequired: boolean;
  isAuthenticated: boolean;

  onUnauthorized: (opts: object) => void;
}

export default class PageBody extends ThemedMixin(WidgetBase)<PageBodyProperties> {

  protected render() {
    const {
      pageTitle, authenticationRequired, isAuthenticated
    } = this.properties;


    if (authenticationRequired && !isAuthenticated) {
      this.properties.onUnauthorized({});
    }
    return v('h1', {classes: [css.root]}, [pageTitle]);
  }
}
