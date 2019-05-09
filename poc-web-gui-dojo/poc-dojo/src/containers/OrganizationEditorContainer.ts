import {Store} from '@dojo/framework/stores/Store';
import {PocState} from '../interfaces';
import {StoreContainer} from '@dojo/framework/stores/StoreInjector';

import OrganizationEditor, {OrganizationEditorProperties} from './../widgets/OrganizationEditor';
import {fetchOrganizationProcess, saveOrganizationProcess, deleteOrganizationProcess} from './../processes/organizationProcesses';

function getProperties(store: Store<PocState>, properties: OrganizationEditorProperties): OrganizationEditorProperties {

  const {get, path} = store;

  return {
    organizationId: properties.organizationId,
    organization: get(path('organizationEditor', 'organization')),

    loaded: get(path('organizationEditor', 'loaded')),
    isAuthenticated: !!get(path('user', 'token')),
    loggedInUser: get(path('user', 'username')),
    getOrganization: fetchOrganizationProcess(store),
    saveOrganization: saveOrganizationProcess(store),
    deleteOrganization: deleteOrganizationProcess(store),
    onFormInput: function () {
      console.log('Something was updated in the Organization Editor');
    },
    onFormSave: function () {
      console.log('Organization Editor wants to save something');
    }
  };
}

export default StoreContainer(OrganizationEditor, 'state', {paths: [['user'], ['organizationEditor']], getProperties});
