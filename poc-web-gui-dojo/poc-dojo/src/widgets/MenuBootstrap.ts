import {WidgetBase} from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import ActiveLink from '@dojo/framework/routing/ActiveLink';
import Link from '@dojo/framework/routing/Link';

// import * as css from "./styles/Menu.m.css";

export interface MenuBootstrapProperties {
  applicationDisplayName: string
  isAuthenticated: boolean;
  loggedInUser: string;
}

export class MenuBootstrap extends WidgetBase<MenuBootstrapProperties> {

  private _authenticatedMenu() {
    const {loggedInUser} = this.properties;

    return [
      v('li', {key: 'people', classes: 'nav-item'}, [
        w(
            ActiveLink,
            {
              to: 'people',
              classes: ['nav-link'],
              activeClasses: ['active']
            },
            ['People']
        )
      ]),

      v('li', {key: 'about', classes: 'nav-item'}, [
        w(
            ActiveLink,
            {
              to: 'about',
              classes: ['nav-link'],
              activeClasses: ['active']
            },
            ['About']
        )
      ]),

      v('li', {key: 'profile', classes: 'nav-item'}, [
        w(
            ActiveLink,
            {
              to: 'profile',
              classes: ['nav-link'],
              activeClasses: ['active']
            },
            [
              v('i', {classes: 'ion-gear'}),
              'Profile'
            ]
        )
      ]),

      v('li', {key: 'login', classes: 'nav-item'}, [
        w(
            ActiveLink,
            {
              to: 'login',
              classes: ['nav-link'],
              activeClasses: ['active']
            },
            ['Login']
        )
      ]),
      v('li', {key: 'user', classes: 'nav-item'}, [
        w(Link, {classes: ['nav-link'], to: 'user', params: {username: loggedInUser}}, [
          v('i', {classes: 'ion-gear'}),
          loggedInUser
        ])
      ])

    ]
  }

  private _unauthenticatedMenu() {
    return [
      v('li', {key: 'sign-in', classes: 'nav-item'}, [
        w(ActiveLink, {classes: ['nav-link'], activeClasses: ['active'], to: 'login'}, ['Sign In'])
      ]),
      v('li', {key: 'sign-up', classes: 'nav-item'}, [
        w(ActiveLink, {classes: ['nav-link'], activeClasses: ['active'], to: 'register'}, ['Sign Up'])
      ])
    ];
  }

  protected render() {
    const {applicationDisplayName, isAuthenticated} = this.properties;

    return v('nav', {classes: ['navbar']}, [
      v('div', {classes: 'container'}, [
        v('a', {classes: 'navbar-brand'}, [applicationDisplayName]),
        v('ul', {classes: ['nav', 'navbar-nav pull-xs-right']}, [
          v('li', {classes: 'nav-item'}, [
            w(ActiveLink, {classes: ['nav-link'], activeClasses: ['active'], to: 'home'}, ['Home'])
          ]),
          ...(isAuthenticated ? this._authenticatedMenu() : this._unauthenticatedMenu()),
          ...this._authenticatedMenu()
        ])
      ])
    ]);
  }
}