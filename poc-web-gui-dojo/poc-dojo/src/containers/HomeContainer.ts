import {Store} from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";
import {State} from "../interfaces";


import Home, {HomeProperties} from "../widgets/Home";


function getProperties(store: Store<State>): HomeProperties {

  console.log(store);


  const {get, path} = store;

  return {
    welcomeMessage: get(path('home', 'properties', 'welcomeMessage'))
  };
}

export default StoreContainer(Home, 'state', {paths: [['home']], getProperties});
