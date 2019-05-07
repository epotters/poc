import {WidgetBase} from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import ActiveLink from '@dojo/framework/routing/ActiveLink';
import {applicationDisplayName} from '../../config';
import {UserSession} from "../interfaces";

export interface MenuProperties {
  currentUser: UserSession;
  isAuthenticated: boolean;
}

export class Menu extends WidgetBase<MenuProperties> {

  protected render() {

    return v('nav', {classes: ['navbar']}, [
      v('div', {classes: 'container'}, [
        v('a', {classes: 'navbar-brand'}, [applicationDisplayName]),
        this._leftMenu(),
        this._rightMenu()
      ])
    ])
  };

  private _leftMenu() {

    const {isAuthenticated} = this.properties;

    return v('ul', {classes: ['nav', 'navbar-nav', 'navbar-left']}, [
      v('li', {classes: 'nav-item'}, [
        w(ActiveLink, {classes: ['nav-link'], activeClasses: ['active'], to: 'home'}, ['Home'])
      ]),
      (isAuthenticated) ?
        v('li', {key: 'people', classes: 'nav-item'}, [
          w(ActiveLink, {to: 'people', classes: ['nav-link'], activeClasses: ['active']}, ['People'])
        ]) : ''
    ])
  }

  private _rightMenu() {

    const {currentUser, isAuthenticated} = this.properties;

    return v('ul', {classes: ['nav', 'navbar-nav', 'navbar-right']}, [
      (isAuthenticated) ?
        v('li', {key: 'currentUser', classes: 'nav-item'}, [
          w(ActiveLink, {to: 'currentUser', classes: ['nav-link'], activeClasses: ['active']}, [
            (currentUser.displayName) ? currentUser.displayName : currentUser.username])
        ])
        :
        v('li', {key: 'sign-in', classes: 'nav-item'}, [
          w(ActiveLink, {classes: ['nav-link'], activeClasses: ['active'], to: 'login'}, ['Sign In'])
        ]),
      v('li', {key: 'about', classes: 'nav-item'}, [
        w(ActiveLink, {to: 'about', classes: ['nav-link'], activeClasses: ['active']}, ['About'])
      ])
    ])
  }
}
