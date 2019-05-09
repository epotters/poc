import {Store} from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";
import {PocState} from "../interfaces";

import OrganizationsList, {OrganizationsListProperties} from "../widgets/OrganizationsList";
import {fetchOrganizationsProcess, updateOrganizationProcess} from "../processes/organizationProcesses";


function getProperties(store: Store<PocState>, properties: OrganizationsListProperties): OrganizationsListProperties {

  return {
    store: store,
    storeId: 'organizationsGridState',
    fetchOrganizations: fetchOrganizationsProcess(store),
    updateOrganization: updateOrganizationProcess(store)
  };
}


// Use a StoreContainer
export default StoreContainer(OrganizationsList, 'state', {paths: [['organizationsList']], getProperties});

