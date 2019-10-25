import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import Outlet from '@dojo/framework/routing/Outlet';
import {MatchDetails} from '@dojo/framework/routing/interfaces';

import MenuContainer from "./containers/MenuContainer";
import Banner from "./widgets/Banner";
import PageBodyContainer from "./containers/PageBodyContainer";
import HomeContainer from "./containers/HomeContainer";
import LoginContainer from "./containers/LoginContainer";
import CurrentUserContainer from "./containers/CurrentUserContainer";

import PeopleListContainer from './containers/PeopleListContainer';
import PersonEditorContainer from './containers/PersonEditorContainer';
import FooterContainer from "./containers/FooterContainer";


export class App extends WidgetBase {
  protected render() {
    return [

      v('header', {}, [
        w(Banner, {name: 'Banner content'}),
        w(MenuContainer, {})
      ]),

      v('main', {classes: ['flex-shrink-0'], role: 'main'}, [

        w(Outlet, {key: 'home', id: 'home', renderer: () => w(HomeContainer, {key: 'home'})}),

        w(Outlet, {key: 'people', id: 'people', renderer: () => w(PeopleListContainer, {key: 'people-list'})}),
        w(Outlet, {
          key: 'new-person',
          id: 'new-person',
          renderer: () => w(PersonEditorContainer, {key: 'person-editor-new'})
        }),

        w(Outlet, {
          key: 'person', id: 'person',
          renderer: (details: MatchDetails) => {
            return w(PersonEditorContainer, {
              key: 'person-editor-edit',
              person: {id: parseInt(details.params.personId)}
            });
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

      v('footer', {classes: ['footer', 'mt-auto', 'bg-light'], role: 'footer'}, [
        w(FooterContainer, {})
      ])
    ]
  }
}
