import {Store} from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";
import {State} from "../interfaces";

import { Login, LoginProperties } from './../widgets/Login';
import { loginProcess, loginEmailInputProcess, loginPasswordInputProcess } from './../processes/loginProcesses';


function getProperties(store: Store<State>): LoginProperties {
  const { get, path } = store;

  return {
    email: get(path('login', 'email')),
    password: get(path('login', 'password')),
    errors: get(path('errors')),
    inProgress: get(path('login', 'loading')),
    onEmailInput: loginEmailInputProcess(store),
    onPasswordInput: loginPasswordInputProcess(store),
    onLogin: loginProcess(store)
  };
}

export default StoreContainer(Login, 'state', { paths: [['login'], ['errors']], getProperties });