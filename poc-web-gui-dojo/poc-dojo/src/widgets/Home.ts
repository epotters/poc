
import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import {v} from "@dojo/framework/widget-core/d";
import {User} from "../interfaces";


export interface HomeProperties {
  currentUser: User;
  isAuthenticated: boolean;
  welcomeMessage: string;
}

export default class Home extends WidgetBase<HomeProperties> {

  protected render() {

    const {welcomeMessage} = this.properties;

    return v('div', {classes: ['container', 'page']}, [
      v('h1', {}, ['Home']),
      v('div', {classes: 'jumbotron'}, [welcomeMessage])
    ]);
  }

}
