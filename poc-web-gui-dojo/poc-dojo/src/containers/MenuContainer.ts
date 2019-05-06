import {Store} from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";
import {State} from "../interfaces";
import {Menu, MenuProperties} from './../widgets/Menu';


function getProperties(store: Store<State>): MenuProperties {
  const {get, path} = store;

  return {
    currentUser: get(path('user')),
    isAuthenticated: !!get(path('user', 'token'))
  };
}

export default StoreContainer(Menu, 'state', {paths: [['user']], getProperties});
