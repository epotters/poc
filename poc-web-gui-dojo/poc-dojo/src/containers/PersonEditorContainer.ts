import {Store} from '@dojo/framework/stores/Store';
import {State} from '../interfaces';
import {StoreContainer} from '@dojo/framework/stores/StoreInjector';

import PersonEditor, {PersonEditorProperties} from './../widgets/PersonEditor';
import {deletePersonProcess, fetchPersonProcess, savePersonProcess} from './../processes/personProcesses';

function getProperties(store: Store<State>, properties: PersonEditorProperties): PersonEditorProperties {

  const {get, path} = store;

  fetchPersonProcess(store)({personId: properties.personId});


  return {
    personId: properties.personId,

    person: get(path('personEditor', 'properties', 'person')),
    loaded: get(path('personEditor', 'loaded')),
    isAuthenticated: !!get(path('user', 'token')),
    loggedInUser: get(path('user', 'username')),
    getPerson: fetchPersonProcess(store),
    savePerson: savePersonProcess(store),
    deletePerson: deletePersonProcess(store),
    onFormInput: function () {
      console.log("Something was updated in the Person Editor");
    },
    onFormSave: function () {
      console.log("Person Editor wants to save something");
    }
  };
}

export default StoreContainer(
  PersonEditor,
  'state', {paths: [['user'], ['personEditor']], getProperties});
