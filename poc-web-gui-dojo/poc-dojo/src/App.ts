import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import Outlet from '@dojo/framework/routing/Outlet';

import Menu from './widgets/Menu';
import Home from './widgets/Home';
import People from "./widgets/People";
import About from './widgets/About';
import Profile from './widgets/Profile';
import Login from "./widgets/Login";
import PersonEditor from "./widgets/PersonEditor";

import * as css from './App.m.css';

export default class App extends WidgetBase {
	protected render() {
		return v('div', {classes: [css.root]}, [
			w(Menu, {}),
			v('div', [
				w(Outlet, {key: 'home', id: 'home', renderer: () => w(Home, {})}),
				w(Outlet, {key: 'people', id: 'people', renderer: () => w(People, {})}),
				w(Outlet, {key: 'person', id: 'person', renderer: () => w(PersonEditor, {})}),
				w(Outlet, {key: 'about', id: 'about', renderer: () => w(About, {})}),
				w(Outlet, {key: 'profile', id: 'profile', renderer: () => w(Profile, {username: 'Dojo User'})}),
				w(Outlet, {key: 'login', id: 'login', renderer: () => w(Login, {})}),
			])
		]);
	}
}
