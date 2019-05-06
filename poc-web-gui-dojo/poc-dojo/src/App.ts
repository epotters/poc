import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import Outlet from '@dojo/framework/routing/Outlet';
import {MatchDetails} from '@dojo/framework/routing/interfaces';

import * as css from './App.m.css';

import MenuContainer from "./containers/MenuContainer";
import PageBodyContainer from "./containers/PageBodyContainer";
import HomeContainer from "./containers/HomeContainer";
import LoginContainer from "./containers/LoginContainer";
import CurrentUserContainer from "./containers/CurrentUserContainer";

import PeopleListContainer from './containers/PeopleListContainer';
import PersonEditorContainer from './containers/PersonEditorContainer';



export class App extends WidgetBase {
  protected render() {
    return v('div', {classes: [css.root]}, [

      v('header', {}, [
        w(MenuContainer, {})
      ]),

      v('main', [

        w(Outlet, {key: 'home', id: 'home', renderer: () => w(HomeContainer, {})}),

        w(Outlet, {key: 'people', id: 'people', renderer: () => w(PeopleListContainer, {})}),
        w(Outlet, {
          key: 'person', id: 'person',
          renderer: (details: MatchDetails) => {
            return w(PersonEditorContainer, {personId: parseInt(details.params.personId)});
          }
        }),

        w(Outlet, {key: 'currentUser', id: 'currentUser', renderer: () => w(CurrentUserContainer, {})}),
        w(Outlet, {
          key: 'login', id: 'login',
          renderer: () => {
            return w(LoginContainer, {});
          }
        }),

        w(Outlet, {
          key: 'about',
          id: 'about',
          renderer: () => w(PageBodyContainer, {pageTitle: 'About', authenticationRequired: true})
        })

      ]),

      v('footer', {}, [])
    ]);
  }
}
