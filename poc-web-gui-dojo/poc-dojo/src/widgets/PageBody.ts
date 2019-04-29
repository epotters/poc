import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v} from '@dojo/framework/widget-core/d';
import {ThemedMixin} from "@dojo/framework/widget-core/mixins/Themed";

import * as css from './styles/MenuBootstrap.m.css';


export interface PageBodyProperties {
  pageTitle: string
}

  export default class PageBody extends ThemedMixin(WidgetBase)<PageBodyProperties>  {


  protected render() {
    const {
      pageTitle
    } = this.properties;
    return v('h1', {classes: [css.root]}, [pageTitle]);
  }
}