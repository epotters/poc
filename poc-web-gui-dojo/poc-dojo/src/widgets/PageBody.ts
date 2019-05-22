import * as css from './styles/PageBody.m.css';
import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import ThemedMixin from "@dojo/framework/widget-core/mixins/Themed";
import {v} from "@dojo/framework/widget-core/d";


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
    return v('div', {classes: ['container', 'page']}, [
      v('h1', {classes: [css.root]}, [pageTitle])
    ]);
  }
}
