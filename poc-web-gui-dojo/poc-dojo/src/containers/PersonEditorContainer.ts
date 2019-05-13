import {Store} from '@dojo/framework/stores/Store';
import {Person, PocState} from '../interfaces';
import {StoreContainer} from '@dojo/framework/stores/StoreInjector';

import PersonEditor, {PersonEditorProperties} from './../widgets/PersonEditor';
import {
  cancelPersonActionProcess,
  clearPersonEditorProcess,
  deletePersonProcess,
  fetchPersonProcess,
  personEditorInputProcess,
  savePersonProcess
} from './../processes/personProcesses';

function getProperties(store: Store<PocState>, properties: PersonEditorProperties): PersonEditorProperties {

  const {get, path} = store;

  const newPerson: Partial<Person> = {
    id: undefined,
    firstName: undefined,
    prefix: undefined,
    lastName: undefined,
    gender: undefined,
    birthDate: undefined,
    birthPlace: undefined,
  };


  return {
    personId: properties.personId,
    person: get(path('personEditor', 'person')) || newPerson,
    loaded: get(path('personEditor', 'loaded')),
    confirmationRequest: get(path('confirmationRequest')),
    errors: get(path('errors')),

    getPerson: fetchPersonProcess(store),
    savePerson: savePersonProcess(store),
    deletePerson: deletePersonProcess(store),
    cancelDeletePerson: cancelPersonActionProcess(store),

    clearEditor: clearPersonEditorProcess(store),
    editorInput: personEditorInputProcess(store)
  };
}

export default StoreContainer(PersonEditor, 'state', {paths: [['user'], ['personEditor']], getProperties});
