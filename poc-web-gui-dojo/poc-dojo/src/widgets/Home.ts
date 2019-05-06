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
      v('div', {classes: 'row'}, [
        v('div', {classes: ['col-md-6', 'offset-md-3', 'col-xs-12']}, [
          v('h1', {classes: 'text-xs-center'}, ['Home Page']),
          v('div', {classes: 'jumbotron'}, [welcomeMessage])
        ])
      ])
    ]);
  }

}
