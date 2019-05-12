import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v} from '@dojo/framework/widget-core/d';

export interface BannerProperties {
  name: string;
}

export default class Banner extends WidgetBase<BannerProperties> {

  protected render() {

    const {name} = this.properties;

    return v('div', {classes: ['banner']}, [
      v('div', {classes: ['container', 'text-muted']}, [
        name
      ])
    ])
  }
}
