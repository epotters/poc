import {Store} from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";

import {PocState} from "../interfaces";
import Home, {HomeProperties} from "../widgets/Home";


function getProperties(store: Store<PocState>): HomeProperties {

  const {get, path} = store;

  const defaultWelcomeMessage: string = 'Hello there, stranger';

  return {
    currentUser: get(path('user')),
    isAuthenticated: !!get(path('session', 'token')),
    welcomeMessage: get(path('home', 'welcomeMessage')) || defaultWelcomeMessage
  };
}

export default StoreContainer(Home, 'state', {paths: [['home'], ['user'], ['session']], getProperties});
