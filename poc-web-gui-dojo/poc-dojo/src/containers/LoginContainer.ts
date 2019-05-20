import {Store} from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";
import {LoginRequest, PocState} from "../interfaces";

import {Login, LoginProperties} from './../widgets/Login';
import {loginProcess, loginRequestInputProcess} from './../processes/loginProcesses';


function getProperties(store: Store<PocState>): LoginProperties {

  const {get, path} = store;

  const emptyLoginRequest: Partial<LoginRequest> = {
    username: undefined,
    password: undefined,
  };


  return {
    loginRequest: get(path('loginRequest')) || emptyLoginRequest,
    inProgress: get(path('loginRequest', 'loading')),
    errors: get(path('errors')),
    onLoginRequestInput: loginRequestInputProcess(store),
    onLogin: loginProcess(store)
  };
}

export default StoreContainer(Login, 'state', {paths: [['session'], ['loginRequest'], ['errors']], getProperties});
