import {Store} from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";
import {PocState} from "../interfaces";
import PageBody, {PageBodyProperties} from './../widgets/PageBody';
import {replace} from "@dojo/framework/stores/state/operations";

function getProperties(store: Store<PocState>, properties: PageBodyProperties): PageBodyProperties {

  const {get, path} = store;

  return {
    pageTitle: properties.pageTitle,
    authenticationRequired: properties.authenticationRequired,
    isAuthenticated: !!get(path('user', 'token')),
    onUnauthorized: function() {return replace(path('routing', 'outlet'), 'home')}
  };
}

export default StoreContainer(PageBody, 'state', {paths: [['user']], getProperties});
