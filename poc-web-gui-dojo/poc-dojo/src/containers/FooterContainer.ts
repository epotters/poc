import Store from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";

import {PocState} from "../interfaces";
import {Footer, FooterProperties} from "../widgets/Footer";


function getProperties(store: Store<PocState>): FooterProperties {
  const {get, path} = store;

  return {
    feedback: get(path('feedback')),
    confirmationRequest: get(path('confirmationRequest'))
  };
}

export default StoreContainer(Footer, 'state', {
  paths: [['feedback'], ['errors'], ['confirmationRequest']],
  getProperties
});
