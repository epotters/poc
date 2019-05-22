import Store from "@dojo/framework/stores/Store";
import {StoreContainer} from "@dojo/framework/stores/StoreInjector";

import {changeRouteProcess} from "../processes/routeProcesses";
import {Person, PocState} from '../interfaces';
import PersonEditor, {PersonEditorProperties} from './../widgets/PersonEditor';
import {
  cancelPersonActionProcess,
  clearPersonEditorProcess,
  deletePersonProcess,
  fetchPersonProcess,
  personEditorInputProcess,
  savePersonProcess
} from './../processes/personProcesses';


function getProperties(store: Store<PocState>): PersonEditorProperties {

  const {get, path} = store;

  const emptyPerson: Partial<Person> = {
    id: undefined,
    firstName: undefined,
    prefix: undefined,
    lastName: undefined,
    gender: undefined,
    birthDate: undefined,
    birthPlace: undefined,
  };


  const person: Person = get(path('personEditor', 'person')) || emptyPerson;
  const previousPerson: Person = get(path('personEditor', 'previousPerson'));
  const nextPerson: Person = get(path('personEditor', 'nextPerson'));


  return {
    person: person,

    canNavigate: get(path('personEditor', 'canNavigate')),
    previousPerson: previousPerson,
    nextPerson: nextPerson,
    hasPrevious: !!previousPerson,
    hasNext: !!nextPerson,
    isNew: (!person || !person.id),
    loaded: get(path('personEditor', 'loaded')),
    hasChanges: get(path('personEditor', 'hasChanges')) || false,

    errors: get(path('errors')),
    getPerson: fetchPersonProcess(store),
    savePerson: savePersonProcess(store),
    deletePerson: deletePersonProcess(store),
    cancelPersonAction: cancelPersonActionProcess(store),
    editorInput: personEditorInputProcess(store),
    clearEditor: clearPersonEditorProcess(store),
    changeRoute: changeRouteProcess(store)
  };
}


export default StoreContainer(PersonEditor, 'state', {paths: [['personEditor'], ['errors']], getProperties});
