import {Store} from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";
import {PocState, User} from "../interfaces";

import {logoutProcess, refreshTokenProcess} from './../processes/loginProcesses';
import CurrentUser, {CurrentUserProperties} from "../widgets/CurrentUser";


function getProperties(store: Store<PocState>): CurrentUserProperties {
  const {get, path} = store;


  const emptyUser: Partial<User> = {
    username: '',
    displayName: '',
    roles: [],
    mail: ''
  };


  return {
    user: get(path('user')) || emptyUser,
    session: get(path('session')),
    errors: get(path('errors')),

    onLogout: logoutProcess(store),
    onRefreshToken: refreshTokenProcess(store)
  };
}

export default StoreContainer(CurrentUser, 'state', {paths: [['user'], ['session']], getProperties});
