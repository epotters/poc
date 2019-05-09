import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v} from '@dojo/framework/widget-core/d';

export interface HomeProperties {
  welcomeMessage: string;
}

export default class Home extends WidgetBase<HomeProperties> {

  protected render() {

    // const defaultWelcomeMessage = 'Hello there, stranger';

    const {welcomeMessage} = this.properties;

    return v('div', {classes: ['container', 'page']}, [
      v('h1', {}, ['Home']),
      v('div', {classes: 'jumbotron'}, [welcomeMessage])
    ]);
  }

}
