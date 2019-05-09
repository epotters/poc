import {Store} from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";
import {PocState} from "../interfaces";

import {logoutProcess, refreshTokenProcess} from './../processes/loginProcesses';
import CurrentUser, {CurrentUserProperties} from "../widgets/CurrentUser";


function getProperties(store: Store<PocState>): CurrentUserProperties {
  const {get, path} = store;


  return {
    user: get(path('user')),
    errors: get(path('errors')),
    // inProgress: get(path('user', 'loading')),
    onLogout: logoutProcess(store),
    onRefreshToken: refreshTokenProcess(store)
  };
}

export default StoreContainer(CurrentUser, 'state', {paths: [['user']], getProperties});
