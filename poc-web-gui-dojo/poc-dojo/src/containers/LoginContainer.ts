import {Store} from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";
import {PocState} from "../interfaces";

import {Login, LoginProperties} from './../widgets/Login';
import {loginPasswordInputProcess, loginProcess, loginUsernameInputProcess} from './../processes/loginProcesses';


function getProperties(store: Store<PocState>): LoginProperties {

  const {get, path} = store;

  return {
    username: get(path('login', 'username')),
    password: get(path('login', 'password')),
    errors: get(path('errors')),
    inProgress: get(path('login', 'loading')),
    onUsernameInput: loginUsernameInputProcess(store),
    onPasswordInput: loginPasswordInputProcess(store),
    onLogin: loginProcess(store)
  };
}

export default StoreContainer(Login, 'state', {paths: [['login'], ['errors']], getProperties});
