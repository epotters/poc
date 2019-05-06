import {Store} from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";
import {State} from "../interfaces";

import {currentUserProcesses, logoutProcess} from './../processes/loginProcesses';
import CurrentUser, {CurrentUserProperties} from "../widgets/CurrentUser";


function getProperties(store: Store<State>): CurrentUserProperties {
  const {get, path} = store;

  return {
    user: get(path('user')),
    errors: get(path('errors')),
    inProgress: get(path('logout', 'loading')),
    onLogout: logoutProcess(store),
    getCurrentUser: currentUserProcesses(store)
  };

}

export default StoreContainer(CurrentUser, 'state', {paths: [['user']], getProperties});
