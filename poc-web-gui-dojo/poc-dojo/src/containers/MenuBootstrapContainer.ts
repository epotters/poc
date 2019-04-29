import {Store} from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";
import {State} from "../interfaces";
import { MenuBootstrap, MenuBootstrapProperties } from './../widgets/MenuBootstrap';


function getProperties(store: Store<State>): MenuBootstrapProperties {
  const { get, path } = store;

  return {
    applicationDisplayName: 'Proof of Concept',
    isAuthenticated: !!get(path('user', 'token')),
    loggedInUser: get(path('user', 'name'))
  };
}

export default StoreContainer(MenuBootstrap, 'state', { paths: [['user']], getProperties });