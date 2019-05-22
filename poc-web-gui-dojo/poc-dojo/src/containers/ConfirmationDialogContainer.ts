import Store from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";

import {PocState} from "../interfaces";
import {ConfirmationDialog, ConfirmationDialogProperties} from "../widgets/ConfirmationDialog";


function getProperties(store: Store<PocState>): ConfirmationDialogProperties {
  const {get, path} = store;

  return {
    visible: !!get(path('confirmationRequest', 'text')),
    confirmationRequest: get(path('confirmationRequest'))
  };
}

export default StoreContainer(ConfirmationDialog, 'state', {paths: [['user']], getProperties});
