import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import Outlet from '@dojo/framework/routing/Outlet';
// import Menu from './widgets/Menu';
import Home from './widgets/Home';
import Profile from './widgets/Profile';
import * as css from './App.m.css';
import {MatchDetails} from '@dojo/framework/routing/interfaces';


import LoginContainer from "./containers/LoginContainer";
import PeopleListContainer from './containers/PeopleListContainer';
import PersonEditorContainer from './containers/PersonEditorContainer';
import PageBody from "./widgets/PageBody";
import MenuBootstrapContainer from "./containers/MenuBootstrapContainer";


export class App extends WidgetBase {
  protected render() {
    return v('div', {classes: [css.root]}, [

      v('header', {}, [
        w(MenuBootstrapContainer, {applicationDisplayName: 'POC'})
        // w(Menu, {})
      ]),

      v('div', [
        w(Outlet, {key: 'home', id: 'home', renderer: () => w(Home, {})}),
        w(Outlet, {key: 'people', id: 'people', renderer: () => w(PeopleListContainer, {})}),
        w(Outlet, {
          key: 'person', id: 'person',
          renderer: (details: MatchDetails) => {
            return w(PersonEditorContainer, {personId: parseInt(details.params.personId)});
          }
        }),
        w(Outlet, {key: 'profile', id: 'profile', renderer: () => w(Profile, {username: 'Dojo User'})}),
        w(Outlet, {
          id: 'login',
          renderer: () => {
            return w(LoginContainer, {});
          }
        }),
        w(Outlet, {key: 'about', id: 'about', renderer: () => w(PageBody, {pageTitle: 'About'})})
      ]),

      v('footer', {}, [])
    ]);
  }
}
